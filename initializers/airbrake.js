exports.airbrake = function(api, next){

  api.airbrake = {};

  api.airbrake.configure = function(){
    var airbrakePrototype = require('airbrake');
    api.airbrake.token  = api.config.airbrake.token;
    api.airbrake.client = airbrakePrototype.createClient(api.airbrake.token);
    api.airbrake.client.handleExceptions(); // catch global uncaught errors
    // api.airbrake.client.developmentEnvironments = []; // don't report in various NODE_ENVs
  }

  api.airbrake.notifier = function(err, type, name, objects, severity){
    api.airbrake.client.notify(err);
  }

  api.airbrake._start = function(api, next){
    if(api.env != 'test'){
      api.airbrake.configure();
      api.exceptionHandlers.reporters.push(api.airbrake.notifier);
    }
    next();
  };

  api.airbrake._stop =  function(api, next){
    next();
  };

  next();
}