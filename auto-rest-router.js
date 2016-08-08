var express = require('express');
var router = express.Router();

for (var controllerName in restControllers) {
  var controller = restControllers[controllerName];

  console.log('Creating routes for ' + controllerName + ' controller');

  router.get('/' + controllerName + '/', controller.collectionGet);
  router.get('/' + controllerName + '/:element', controller.elementGet);
  router.put('/' + controllerName + '/:element', controller.elementPut);
  router.put('/' + controllerName + '/', controller.collectionPut);
  router.post('/' + controllerName + '/:element', controller.elementPost);
  router.post('/' + controllerName + '/', controller.collectionPost);
  router.delete('/' + controllerName + '/:element', controller.elementDelete);
  router.delete('/' + controllerName + '/', controller.collectionDelete);

  router.get('/' + controllerName + '/:element/', controller.elementGet);
  router.get('/' + controllerName, controller.collectionGet);
  router.put('/' + controllerName + '/:element/', controller.elementPut);
  router.put('/' + controllerName, controller.collectionPut);
  router.post('/' + controllerName + '/:element/', controller.elementPost);
  router.post('/' + controllerName, controller.collectionPost);
  router.delete('/' + controllerName + '/:element/', controller.elementDelete);
  router.delete('/' + controllerName, controller.collectionDelete);
}

module.exports = router;