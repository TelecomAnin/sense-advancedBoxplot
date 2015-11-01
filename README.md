# Qlik Sense Box Plot Extension
###Tested in: Chrome on Qlik Sense 2.1.1 Server and Desktop
###Use Case:
A user wants to view numeric data and associated statistics in a box plot.
box plot wiki: https://en.wikipedia.org/wiki/Box_plot

###Info:
1. This is a visualization extension using D3Plus javascript. Documentation can be found here: http://d3plus.org/examples/basic/78018ce8c3787d4e30d9/
2. Tukey ranges are calculated based on 1.5x IQR.

This extension allows users to make selections and view statistics at the click of a button or through a hover-over. 

###Setup:
1. Place the Box-Plot folder in the standard Qlik Sense extension folder.
2. Add the extension to the screen.
3. Place the dimension for which you would like the visualization drawn as the first placeholder.
4. Place the numeric field in the second placeholder in the DIMENSION section.
5. Place the same numeric field in the first placeholder in the MEASURES section

![Screenshot](https://raw.githubusercontent.com/balexbyrd/img/master/BoxPlot1.PNG)
![Screenshot](https://raw.githubusercontent.com/balexbyrd/img/master/BoxPlot2.PNG)

If this fails, try the demo .qvf supplied.

###Requests:
1. Size the scatter plot points to specified pixels *important*
2. Selecting only the outlier values (and not the whole dimension)
3. Lasso feature
4. Color the points by measure or expression
5. Reference line across all box plots
6. Paint the whiskers and median lines

