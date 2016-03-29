import os

def get_transcripts(pulse_names_output_file):
    """
    Returns a list of all transcripts that appear in order from
    original PULSE output.

    :param pulse_names_output_file
    :return: transcripts_list
    """
    pulse_output = open(pulse_names_output_file, 'r')
    transcript_list = []
    for line in pulse_output:
        transcript = line.split(";")[0].strip("\"").split("\"")[1]
        transcript_list.append(transcript)
    return transcript_list


def get_proteins(pulse_names_output_file):
    """
    Returns a list of all proteins that appear in order from
    original PULSE output.

    :param pulse_names_output_file:
    :return:
    """
    pulse_output = open(pulse_names_output_file, "r")
    protein_list = []
    for line in pulse_output:
        protein = line.split("//")[-1].strip()
        protein_list.append(protein)
    return protein_list


def get_scores(pulse_scores_output_file):
    """
    Returns a list of all proteins' scores that appear
    in the order from pulse output.

    :param pulse_scores_output_file:
    :return:
    """
    pulse_scores = open(pulse_scores_output_file, "r")
    score_list = []
    for line in pulse_scores:
        score = line.strip()
        score_list.append(score)
    return score_list


def get_pfam(pulse_pfam_output_file):
    """
    Returns list of lists of all of the 
    pfam data.

    index/category:
    0/<seq id> 
    1/<alignment start> 
    2/<alignment end>
    3/<envelope start> 
    4/<envelope end>
    5/<hmm acc>
    6/<hmm name> 
    7/<type>
    8/<hmm start>
    9/<hmm end>
    10/<hmm length> 
    11/<bit score>
    12/<E-value>
    13/<significance>
    14/<clan>

    :param pulse_pfam_output_file
    :return: pfam_list
    """
    pulse_pfam = open(pulse_pfam_output_file, "r");
    pfam_list = []
    for line in pulse_pfam:
        # holds data for current line's sequence pfam data
        sl = [] # sl = seq list
        if line[0] != "#" and line[0] != "\n":
            sl = line.split()
            # transcript = sl[0].split(";")[0].strip("\"").split("\"")[1]
            # build pfam_list
            pfam_list.append([sl[0], sl[1], sl[2], sl[3], sl[4], sl[5],
                                sl[6], sl[7], sl[8], sl[9], sl[10],
                                sl[11], sl[12], sl[13], sl[14]])
    return pfam_list


def get_elm(pulse_elm_output_file):
    """
    Returns the dictionary of all of the elm data.

    index/category:
    0/seq id
    1/protein
    2/?
    3/?
    4/?
    5/?
    
    :param pulse_elm_output_file
    :return elm_dict
    """
    pulse_elm = open(pulse_elm_output_file, "r")
    elm_list = []
    for line in pulse_elm:
        sl = []
        sl = line.split()
        transcript = sl[0].split(";")[0].strip("\"").split("\"")[1]
        elm_list.append([sl[0], transcript, sl[1], sl[2], sl[3], sl[4], sl[5]])
    return elm_list


def merge_pfam_and_elm(elm_list, pfam_list):
    """
    Merges the pfam and elm lists to return a large list of all elements.
    Usually, elm_list will be larger than pfam_list.

    merged_pfam_and_elm will look like:
    {transcript1: [seq_id, transcript, ... , clan], 
    ...,
    ..., 
    transcriptN: [seq_id, transcript, ... , clan]}

    index/category:
    0/<seq id>
    1/transcript
    2/protein
    3/elm_1
    4/elm_2
    5/elm_3
    6/elm_4
    7/<alignment start> 
    8/<alignment end>
    9/<envelope start> 
    10/<envelope end>
    11/<hmm acc>
    12/<hmm name> 
    13/<type>
    14/<hmm start>
    15/<hmm end>
    16/<hmm length> 
    17/<bit score>
    18/<E-value>
    19/<significance>
    20/<clan>
    
    :param elm_list
    :param pfam_list
    :return merged_pfam_and_elm
    """

    merged_dict = {}
    for data in elm_list:
        merged_dict[data[0]] = [data[1], data[2], data[3], data[4], 
                                data[5], data[6]]

    for data in pfam_list:
        merged_dict[data[0]] += [data[1], data[2], data[3], data[4],
                                    data[5], data[6], data[7], data[8],
                                    data[9], data[10], data[11], data[12],
                                    data[13], data[14]]
    print(merged_dict)
    return merged_dict


if __name__ == "__main__":
    transcript_list = get_transcripts('data/names.txt')
    protein_list = get_proteins('data/names.txt')
    score_list = get_scores('data/pulse_output.txt')
    pfam_list = get_pfam('data/pfam_done.txt')
    elm_list = get_elm('data/elm_read.txt')
    merged_pfam_and_elm = merge_pfam_and_elm(elm_list, pfam_list)

    # Reduce protein and transcript to score
    # index_list = [i for i in range(0, len(protein_list) - 1)]
    protein_to_score = zip(protein_list, score_list)
    transcripts_to_score = zip(transcript_list, score_list)

    transcript_to_protein_to_score = zip(transcript_list, protein_list, score_list)

    # Sort by probability
    transcript_to_protein_to_score_sorted_by_score = sorted(transcript_to_protein_to_score, key=lambda x: x[2])

    # Write to file in data/
    with open('data/protein_to_score.txt', 'w') as f:
        # Change this between protein_to_score || transcript_to_score
        count = 1
        last = len(transcript_to_protein_to_score_sorted_by_score)
        f.write("index,transcript,protein,probability,\n")
        for triplet in transcript_to_protein_to_score_sorted_by_score:
            if count != last:
                f.write("{},{},{},".format(count, triplet[0], triplet[1]))
                f.write("{0:.5f}\n".format(float(triplet[2])))
                count = count + 1
            else:
                f.write("{},{},{},".format(count, triplet[0], triplet[1]))
                f.write("{0:.5f}".format(float(triplet[2])))

    # index/category:
    # 0/<seq id>
    # 1/transcript
    # 2/protein
    # 3/elm_1
    # 4/elm_2
    # 5/elm_3
    # 6/elm_4
    # 7/<alignment start> 
    # 8/<alignment end>
    # 9/<envelope start> 
    # 10/<envelope end>
    # 11/<hmm acc>
    # 12/<hmm name> 
    # 13/<type>
    # 14/<hmm start>
    # 15/<hmm end>
    # 16/<hmm length> 
    # 17/<bit score>
    # 18/<E-value>
    # 19/<significance>
    # 20/<clan>

    with open('data/seqid_to_pfam_and_elm.txt', 'w') as f:
        count = 1
        last = len(merged_pfam_and_elm)
        f.write("transcript,seq_id,protein,elm_1,elm_2,elm_3,elm_4,hmm_acc,hmm_name,type,e_value,significance,clan\n")
        for k, v in merged_pfam_and_elm.items():
            no_transcript = k.split(";")[1]
            chromosome_start_end_else = no_transcript.split("_")
            all_else = k.split("-")[1]
            k = chromosome_start_end_else[0] + "_" + chromosome_start_end_else[1] + "_" + chromosome_start_end_else[2]

            f.write("{},{},{},".format(v[0], k, v[1]))
            f.write("{0:.3f},".format(float(v[2])))
            f.write("{0:.3f},".format(float(v[3])))
            f.write("{0:.3f},".format(float(v[4])))
            f.write("{0:.3f}".format(float(v[5])))
            if count != last:
                try:
                    f.write(",{},{},{},{},{},{}\n".format(
                        v[10], v[11], v[12], v[17], v[18], v[19]))
                except IndexError:
                    f.write("\n")
            else:
                try:
                    f.write(",{},{},{},{},{},{}".format(
                        v[10], v[11], v[12], v[17], v[18], v[19]))
                except IndexError:
                    pass
            count += 1

