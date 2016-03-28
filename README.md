# pulse-data-viz
Visualizing data from PULSE + comparing probabilities of protein stability from alternative splicing data.
For use in tandem with [PULSE](https://github.com/wonjunetai/pulse) pipeline from this paper: [Semi-supervised Learning Predicts Approximately One Third of the Alternative Splicing Isoforms as Functional Proteins](http://www.cell.com/cell-reports/pdf/S2211-1247(15)00643-9.pdf).

### preprocessing data ###
From PULSE, copy over the `pfam_done.out` and `elm_read.out` from the `pulse/output/features/<cell_line>` directory into the `pulse-data-viz/data` directory. Do the same for `names.txt` and `PULSE_Output.txt` in `pulse/output/machine/<cell_line>`.

Finally, run `pulse-data-viz/helpers/get_transcript_and_score.py`. You're now ready to visualize the data.


### setup ###
```
git clone https://github.com/wonjunetai/pulse-data-viz.git
cd pulse-data-viz
python -m SimpleHTTPServer 8080 # start python server
```

Check out the visualization at `localhost:8080`.
