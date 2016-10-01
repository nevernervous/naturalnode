// **************************************
// * Simple helper for modifing objects *
// **************************************
var ObjectModifier = function(){

  var modifiedObject = {};

  modifiedObject.addArrayPropertiesToObject = function( inObject, properties ){

    properties.forEach(function(property){
      	inObject[property] = [];
    });
  }

  return modifiedObject;
}

module.exports =  ObjectModifier;

