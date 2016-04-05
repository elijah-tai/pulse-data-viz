import os
import sys
import re
import json
import get_transcript_and_score
from string import*


def init_elm_dict(elm_classes_file):
    """
    Reads elm_classes_file, and creates elm_dict.

    :param: elm_classes_file
    :return: elm_dict
    """
    elm_dict = {}
    f = open(elm_classes_file, "r")
    data = f.readlines()
    f.close()

    for line in data:
        if line[0] != "#":
            line = line.strip()
            if "Accession" in line:
                continue
            line = line.split("\t")

            # remove double quotes
            for i in range(len(line)):
                line[i] = line[i][1:-1]

            accession = line[0].strip()
            elm_dict[accession] = ["-", "-", "-"]
            identifier = line[1].strip()
            regex = line[4].strip()
            prob = line[5].strip()

            elm_dict[accession][0] = identifier
            elm_dict[accession][1] = regex
            elm_dict[accession][2] = float(prob)

    return elm_dict


def find_motif_for_entry(elm_json, entry, seq, elm_dict, index):
    """
    Finds regex motif for entry given its protein sequence.
    """
    D = {}
    # for each accession id in elm_dict, check if there 
    # is a match in the sequence
    for i in elm_dict:
        regex = elm_dict[i][1]
        m = re.search(regex, seq)
        # if match, add to dictionary
        if str(m) != "None":
            D[i] = [elm_dict[i][2], m.span()]

    elm_count = 0 # keeps track of where the current working elm is
    for k, v in sorted(D.items(), key = lambda item:item[1]):
        if v[0] < 0.005:
            elm_json[index]["elms"].append({"elm_id": elm_dict[k][0]})
            elm_json[index]["elms"][elm_count]["probability"] = v[0]
            elm_json[index]["elms"][elm_count]["start"] = v[1][0]
            elm_json[index]["elms"][elm_count]["end"] = v[1][1]
            elm_count += 1
    return elm_json


def read_protein_sequence_and_get_motif(protein_sequence_file, elm_dictionary, pfam_file, merged_pfam_and_elm):
    """
    Read the protein sequence of isoforms, and get motif.

    """
    with open(protein_sequence_file, "r") as f:
        data = f.readlines()

    result_json = []

    count = 0 # keeps track of the current working entry
    for i in range(len(data)):
        if ">" in data[i]:
            print(count)
            entry = data[i].strip()
            entry = entry.replace(">", "")
            seq = data[i+1].strip()
            result_json.append({"entry": entry})
            split_entry = entry.split("_")
            result_json[count]["protein"] = str(merged_pfam_and_elm[entry][1])
            result_json[count]["start"] = split_entry[1]
            result_json[count]["end"] = split_entry[2].split("-")[0]
            result_json[count]["elms"] = []
            result_json[count]["pfam"] = []
            result_json = find_motif_for_entry(result_json, entry, seq, elm_dictionary, count)
            final_json = add_pfam_coords(result_json, pfam_file, count)
            count += 1
    return final_json


def add_pfam_coords(result_json, pfam_file, index):
    """
    Adds the pfam data to resulting json at {transcriptID: "pfam": {...}}

    """
    pfam_count = 0
    pfam_list = get_transcript_and_score.get_pfam(pfam_file)
    for i in pfam_list:
        if result_json[index]["entry"] == i[0]:
            # no pfams yet
            result_json[index]["pfam"].append({"pfam_id": i[5]})
            result_json[index]["pfam"][pfam_count]["start"] = int(i[1])
            result_json[index]["pfam"][pfam_count]["end"] = int(i[2])

    return result_json


def find_min_max(final_json):
    """
    Finds the minimum and maximum values of start and end, respectively,
    in final_json.
    """
    start_array = []
    end_array = []

    for i in range(len(final_json)):
        start_array.append(final_json[i]["start"])
        end_array.append(final_json[i]["end"])

    min_start = min(start_array)
    max_end = max(end_array)

    return min_start, max_end


if __name__ == "__main__":
    elm_dict = init_elm_dict("data/elm_classes.tsv")

    pfam_list = get_transcript_and_score.get_pfam('data/pfam_done.txt')
    elm_list = get_transcript_and_score.get_elm('data/elm_read.txt')
    merged_pfam_and_elm = get_transcript_and_score.merge_pfam_and_elm(elm_list, pfam_list)
    final_json = read_protein_sequence_and_get_motif("data/p_seq_isoforms.fas", elm_dict, "data/pfam_done.txt", merged_pfam_and_elm)
    print(final_json)

    min_start, max_end = find_min_max(final_json)

    print(min_start)
    print(max_end)

    with open("data/elm_and_pfam_full.json", "w") as outfile:
        json.dump(final_json, outfile, ensure_ascii=False)
