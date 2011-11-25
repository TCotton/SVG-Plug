var SVG = {};

SVG.ImgReplace = (function () {
    //attributes
    var objX, jsonData, y, len, key, bodyChildren, x, svgObject, newImg, root, newParent, result;

    //methods
    function getJSON() {
        // getJSON uses standard AJAX techniques to snatch and parse JSON file created by service side script
        objX = new XMLHttpRequest();

        if (objX !== null) {
            objX.open("GET", "json/low-resulution-images.json", true);
            objX.onreadystatechange = function () {
                //if readyState is not 4 or or status not 200 then there is a problem that needs attending
                if (objX.readyState === 4) {
                    if (objX.status === 200) {
                        jsonData = eval("(" + objX.responseText + ")"); //take result as an JavaScript object
                        processJSON();
                    } else {
                        alert('HTTP error ' + objX.status);
                    }
                }
            };

            objX.send();

        } else {
            alert("You do not have AJAX implemented on your browser, sorry.");
        }
    } // end getJSON

    function processJSON() {

        bodyChildren = document.body.getElementsByTagName("object");
        x = 0;
		
        for (len = bodyChildren.length; x < len; x += 1) {
            // Look through all objects on the page
            svgObject = bodyChildren[x];

            // make sure object is SVG
            if (svgObject.getAttribute("type") === "image/svg+xml") {
                newImg = document.createElement("img");
                result = bodyChildren[x].data.substr(0, bodyChildren[x].data.lastIndexOf('.'));
                // Removes the file extension from SVG url
                result = result.substring(result.lastIndexOf('/') + 1);
				
                // Removes everything before the last slash
                for (key in jsonData) {
                    // loop through JSON object
                    if (jsonData.hasOwnProperty(key)) {

                        if (result === jsonData[key].file.substr(0, jsonData[key].file.lastIndexOf('.'))) {

                            newImg.src = "images/l/" + jsonData[key].file;

                        } // end if
                    } // end if
                } // end for in loop
				
                // Apply width and height of the svg to the new img if that is set in svg object
                if (svgObject.getAttribute("width") !== null) {
                    newImg.width = svgObject.getAttribute("width");
                    newImg.height = svgObject.getAttribute("height");
                }
				
                // If object has id then use that attribute
                if (svgObject.getAttribute("id") !== null) {
                    newImg.id = svgObject.getAttribute("id");
                }

                // alt for image must be placed in title attribute
                if (svgObject.getAttribute("title") !== null) {
                    newImg.alt = svgObject.getAttribute("title");
                }

                // apply classname if known
                if (svgObject.getAttribute("class") || svgObject.getAttribute("className") !== null) {
                    newImg.className = svgObject.getAttribute("class") || svgObject.getAttribute("className");
                }

                // declare parent of svg object
                root = svgObject.parentNode;
                newParent = document.createElement('div');
                // Insert new node as a child or the root directly before the svg object
                root.insertBefore(newParent, svgObject);
                // Append svg object to the new parent
                newParent.appendChild(svgObject);
                // Append new image to the parent node
                svgObject.parentNode.appendChild(newImg);
                // Remove the svg object
                //$svgObject.parentNode.removeChild($svgObject);
                // ouch, removing the node has given me headaches 
                // so for now we will just set it to display none
                svgObject.className += " hidden";

            } // end if statement
        } // end for loop
    } // end processJSON
    return {

        init: function () {
            // public method
            // SVG object detection
            // don't forget to change for intenet explorer
            if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
                getJSON();
            }
        }
    }; // end return
})(); // end SVG.ImgReplace object