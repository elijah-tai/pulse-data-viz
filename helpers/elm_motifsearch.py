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


def find_motif_for_entry(elm_json, entry, seq, elm_dict):
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

    for k, v in sorted(D.items(), key = lambda item:item[1]):
        if v[0] < 0.005:
            elm_json[entry]["ELM"][elm_dict[k][0]] = {}
            elm_json[entry]["ELM"][elm_dict[k][0]]["probability"] = v[0]
            elm_json[entry]["ELM"][elm_dict[k][0]]["coordinates"] = v[1]
    return elm_json


def read_protein_sequence_and_get_motif(protein_sequence_file, elm_dictionary):
    """
    Read the protein sequence of isoforms, and get motif.

    """
    with open(protein_sequence_file, "r") as f:
        data = f.readlines()

    result_json = {}

    for i in range(len(data)):
        print(i)
        if ">" in data[i]:
            entry = data[i].strip()
            entry = entry.replace(">", "")
            seq = data[i+1].strip()
            result_json[entry] = {"ELM": {}}
            result_json = find_motif_for_entry(result_json, entry, seq, elm_dictionary)
    return result_json


def add_pfam_coords(result_json, pfam_file):
    """
    Adds the pfam data to resulting json at {transcriptID: "pfam": {...}}

    """
    pfam_list = get_transcript_and_score.get_pfam(pfam_file)
    for i in pfam_list:
        try:
            entry = i[0]
            result_json[entry]["PFAM"] = {}
            result_json[entry]["PFAM"][i[5]] = {"coordinates": (int(i[1]), int(i[2]))}
        except KeyError as e:
            print(e)
    return result_json


if __name__ == "__main__":
    elm_dict = init_elm_dict("data/elm_classes.tsv")
    elm_json = read_protein_sequence_and_get_motif("data/p_seq_isoforms.fas", elm_dict)

    print(elm_json)
    final_json = add_pfam_coords(elm_json, "data/pfam_done.txt")
    
    with open("data/disorderome_motifs_nofilter.json", "w") as outfile:
        json.dump(final_json, outfile, ensure_ascii=False)
