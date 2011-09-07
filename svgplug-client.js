var SVG = {};

SVG.ImgReplace = (function () {
    //private attributes
    var _objX, _jsonData, _y, _len, _key, _bodyChildren, _x, _svgObject, _newImg, _root, _newParent, _result;

    // private methods

    function _getJSON() {
        // getJSON uses standard AJAX techniques to snatch and parse JSON file created by service side script
        _objX = new XMLHttpRequest();

        if (_objX !== null) {

            _objX.open("GET", "json/low-resulution-images.json", true);

            _objX.onreadystatechange = function () {

                //if readyState is not 4 or or status not 200 then there is a problem that needs attending
                if (_objX.readyState === 4) {
                    if (_objX.status === 200) {

                        _jsonData = eval("(" + _objX.responseText + ")"); //take result as an JavaScript object
                        _processJSON();

                    } else {

                        alert('HTTP error ' + _objX.status);
                    }
                }
            };

            _objX.send();

        } else {

            alert("You do not have AJAX implemented on your browser, sorry.");
        }
    } // end getJSON

    function _processJSON() {

        _bodyChildren = document.body.getElementsByTagName("object");

        _x = 0;

        for (_len = _bodyChildren.length; _x < _len; _x += 1) {
            // Look through all objects on the page
            _svgObject = _bodyChildren[_x];

            _newImg = document.createElement("img");

            _result = _bodyChildren[_x].data.substr(0, _bodyChildren[_x].data.lastIndexOf('.'));
            // Removes the file extension from SVG url
            _result = _result.substring(_result.lastIndexOf('/') + 1);
            // Removes everything before the last slash
            for (_key in _jsonData) {
                // loop through JSON object
                if (_jsonData.hasOwnProperty(_key)) {

                    if (_result === _jsonData[_key].file.substr(0, _jsonData[_key].file.lastIndexOf('.'))) {

                        _newImg.src = "images/l/" + _jsonData[_key].file;

                    } // end if
                } // end if
            } // end for in loop
            // Apply width and height of the svg to the new img if that is set in svg object
            if (_svgObject.getAttribute("width") !== null) {

                _newImg.width = _svgObject.getAttribute("width");
                _newImg.height = _svgObject.getAttribute("height");

            }

            // If object has id then use that attribute
            if (_svgObject.getAttribute("id") !== null) {

                _newImg.id = _svgObject.getAttribute("id");

            }

            // alt for image must be placed in title attribute
            if (_svgObject.getAttribute("title") !== null) {

                _newImg.alt = _svgObject.getAttribute("title");

            }

            // apply classname if known
            if (_svgObject.getAttribute("class") || _svgObject.getAttribute("className") !== null) {

                _newImg.className = _svgObject.getAttribute("class") || _svgObject.getAttribute("className");

            }

            // declare parent of svg object
            _root = _svgObject.parentNode;
            _newParent = document.createElement('div');

            // Insert new node as a child or the root directly before the svg object
            _root.insertBefore(_newParent, _svgObject);

            // Append svg object to the new parent
            _newParent.appendChild(_svgObject);

            // Append new image to the parent node
            _svgObject.parentNode.appendChild(_newImg);

            // Remove the svg object
            //$svgObject.parentNode.removeChild($svgObject);
            // ouch, removing the node has given me headaches 
            // so for now we will just set it to display none
            _svgObject.className += " hidden";

        } // end for loop
    } // end processJSON
    return {

        init: function () {
            // public method
            // SVG object detection
            // don't forget to change for intenet explorer
            if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {

                _getJSON();

            }
        }
    }; // end return
})(); // end SVG.ImgReplace object