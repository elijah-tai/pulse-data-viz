import os, sys, re
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


def motif(entry, seq, elm_dict, output_filename):
    """
    Carles' motif function.

    """

    D = {}
    for i in elm_dict:
        regex = elm_dict[i][1]
        m = re.search(regex, seq)
        if str(m) != "None":
            D[i] = [elm_dict[i][2], m.span()]

    output = ''
    result = open(output_filename, "a")
    for k, v in sorted(D.items(), key = lambda item:item[1]):
        if v[0] < 0.005:
            output += elm_dict[k][0] + ' (' + str(v[0]) + ', ' + str(v[1]) + ') '

    print >> result, entry, "\t",output, "\t"


def read_protein_sequence_and_get_motif(protein_sequence_file, elm_dictionary, output_filename):
    """
    Read the protein sequence of isoforms, and get motif.

    """
    with open(protein_sequence_file, "r") as f:
        data = f.readlines()

    for i in range(len(data)):
        if ">" in data[i]:
            entry = data[i].strip()
            entry = entry.replace(">", "")
            entry = "DIS_"+entry.strip()
            seq = data[i+1].strip()
            motif(entry, seq, elm_dictionary, output_filename)


if __name__ == "__main__":
    print("Building elm_dict\n")
    elm_dict = init_elm_dict("data/elm_classes.tsv")
    print("reading protein sequence file and getting motif")
    read_protein_sequence_and_get_motif("data/p_seq_isoforms.fas", elm_dict, "data/disorderome_motifs_nofilter.txt")