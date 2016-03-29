import os
import sys
import re
import json
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


def motif(elm_json, entry, seq, elm_dict):
    """

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
            elm_json[entry]["elm"][elm_dict[k][0]] = {}
            elm_json[entry]["elm"][elm_dict[k][0]]["probability"] = v[0]
            elm_json[entry]["elm"][elm_dict[k][0]]["coordinates"] = v[1]
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
            entry = "DIS_"+entry.strip()
            seq = data[i+1].strip()
            result_json[entry] = {"elm": {}}
            result_json = motif(result_json, entry, seq, elm_dictionary)
    return result_json


def add_pfam_to_result_json(result_json, pfam_file):
    """
    Adds the pfam data to resulting json at {transcriptID: "pfam": {...}}

    """

    return result_json


if __name__ == "__main__":
    print("Building elm_dict\n")
    elm_dict = init_elm_dict("data/elm_classes.tsv")

    print("reading protein sequence file and getting motif\n")
    elm_json = read_protein_sequence_and_get_motif("data/p_seq_isoforms.fas", elm_dict)
    final_json = add_pfam_to_result_json(elm_json, "data/seqid_to_pfam_elm.out")

    print("writing to json file now")
    # write json to file now
    with open("data/disorderome_motifs_nofilter.json", "w") as outfile:
        json.dump(elm_json, outfile, ensure_ascii=False)