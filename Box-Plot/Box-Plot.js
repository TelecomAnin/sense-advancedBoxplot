define(["jquery", "qlik", "./js/d3", "./js/d3plus"],
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
						max: 2,
						
					},
					measures: {
						uses: "measures",
						min: 1
					},                    
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

				 var lastrow = 2000;
				 var me = this; 
				 
				 //loop through the rows we have and render
				 this.backendApi.eachDataRow( function ( rownum, row ) {
							lastrow = rownum;
							//do something with the row..
				 });
			  
				 if (this.backendApi.getRowCount() > lastrow + 1) {
						 //we havent got all the rows yet, so get some more, 1000 rows
						  var requestPage = [{
								qTop: lastrow + 1,
								qLeft: 0,
								qWidth: 3, //should be # of columns
								qHeight: Math.min(2000, this.backendApi.getRowCount() - lastrow )
							}];
						   this.backendApi.getData( requestPage ).then( function ( dataPages ) {
									//when we get the result trigger paint again
									me.paint( $element, layout );
						   } );
				 }				

				var hc = layout.qHyperCube;

                $element.empty();	
				
				var createHTML = '<div id="viz"></div>';
				
				$element.append(createHTML );
				
				
				var data = [];
				var txt = [];	
						for (var r = 0; r < hc.qDataPages[0].qMatrix.length; r++) {
							var Num = hc.qDataPages[0].qMatrix[r][1].qNum;
							
							if (isNaN(Num)===false){
								data.push({"Dimension": hc.qDataPages[0].qMatrix[r][0].qText,"Metric": hc.qDataPages[0].qMatrix[r][1].qNum, "Value": hc.qDataPages[0].qMatrix[r][2].qNum});
							}
						};
			  
			    var fieldName = hc.qDimensionInfo[0].qFallbackTitle;
			    
			    // define the click handler for the boxes
				var boxClick = function(dp, vi) {

				  var selectedValue = dp.Dimension;
				  var app = qlik.currApp();
				  
				  if (fieldName && selectedValue) {
				    app.field(fieldName).selectMatch(selectedValue);
				  }
				  
				};
				
				
				var visualization = d3plus.viz()
					.container("#viz")
					.data(data)
					.type("box")
					.id("Metric")
					.x("Dimension")
					.y("Value")
					.ui([{ 
						"label": "Visualization Type",
						"method": "type", 
						"value": ["box","scatter"]
					}])
				    .mouse({
					  click: function(dataPoint, vizInstance) {
						boxClick(dataPoint, vizInstance);
					  }
				    })
					.draw();
			}
        };

    } );