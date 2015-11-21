function PlotViz(me, $element, layout, bigMatrix) {
	
	// Enter Dimensions in Qlik Sense in following order:
	// 1. X Axis Dimension ie. Age, Height, Test
	// 2. Point Value or Name ie. Full Name
	// 3. Y Axis Value ie. Inches
	// This would plot all of the ages for people. Each point/dot would correspond to a persons name with a specific height.
	
	var hc = layout.qHyperCube;
	//console.log('pv');

	$element.empty();	

	var id = senseUtils.setupContainer($element,layout,layout.qInfo.qId);												
	var data = [];
	var txt = [];	
			for (var r = 0; r < bigMatrix.length; r++) {
					data.push({"Dimension": bigMatrix[r][0].qText,"Metric": bigMatrix[r][1].qText, "Value": bigMatrix[r][2].qNum});
			};
	
	var fieldName = hc.qDimensionInfo[0].qFallbackTitle;
	
	// define the click handler for the boxes
	var boxClick = function(dp, vi) {

	  var selectedValue = dp.Dimension;
	  var app = qlik.currApp();
	  
	  if (fieldName && selectedValue) {
		//console.log(fieldName);
		//console.log(selectedValue);
		app.field(fieldName).selectMatch(selectedValue);
	  };
	  
	};
	var visualization = d3plus.viz()
		.container('#'+id)
		//.container('#viz')
		.data(data)
		.type("box")
		.id("Metric")
		.x("Dimension")
		.y("Value")
		// uncomment for scatter plot functionality
		// .ui([{ 
			// "label": "Visualization Type",
			// "method": "type", 
			// "value": ["box","scatter"]
		// }])
		.mouse({
		  click: function(dataPoint, vizInstance) {
			console.log(dataPoint);
			boxClick(dataPoint, vizInstance);
		  }
		})
		.draw();

}
function pageExtensionData(me, $element, layout) {	
	var lastrow = 0
	//get number of columns
	var colNums = layout.qHyperCube.qSize.qcx;
	//calculate how many rows to page. currently, you can't ask for more than 10,000 cells at a time, so the number of rows
	//needs to be 10,000 divided by number of columns
	var calcHeight = Math.floor(10000 / colNums);
	//loop through the rows we have and render
	
	me.backendApi.eachDataRow(function(rownum, row) {
		//simply by looping through each page, the qHyperCube is updated and will not have more than one page
		lastrow = rownum;
	});
	if (me.backendApi.getRowCount() > lastrow + 1) {//if we're not at the last row...
		//we havent got all the rows yet, so get some more.  we first create a new page request
		var requestPage = [{
			qTop : lastrow + 1,
			qLeft : 0,
			qWidth : colNums,
			//should be # of columns
			qHeight : Math.min(calcHeight, me.backendApi.getRowCount() - lastrow)
		}];
		me.backendApi.getData(requestPage).then(function(dataPages) {
			//when we get the result run the function again
			pageExtensionData(me, $element, layout);
		});
	} else {//if we are at the last row...
		var bigMatrix = [];
		//use flattenPages function to create large master qMatrix
		bigMatrix = senseUtils.flattenPages(layout.qHyperCube.qDataPages);
		//console.log('ped');
		PlotViz(me, $element, layout, bigMatrix);	
	};
};
define(["jquery", "qlik", "./js/d3.min", "./js/d3plus", "./js/senseUtils"],
    function ($, qlik) {
        'use strict';

        return {

            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimensions: {
                        uses: "dimensions",
						min: 2,
						max: 10,
						
					},
					// measures: {
						// uses: "measures",
						// min: 1
					// },                    
					sorting: {
                        uses: "sorting"
                    },
					addons: {  
						 uses: "addons",  
						 items: {  
							  dataHandling: {  
								   uses: "dataHandling"  
							  }  
						 }  
					},
                    appearance: {
                        uses: "settings"
                    }
                }
            },
			snapshot: {
				canTakeSnapshot: true
			},			
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [
                        {
                            qWidth: 3,
                            qHeight: 2000
                        }
                    ]
                }
            },
            paint: function ( $element, layout ) {				
				pageExtensionData(this, $element, layout);
			}
        };

    } );