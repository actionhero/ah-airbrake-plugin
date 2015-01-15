var _ = require('underscore');
var airbrakePrototype = require('airbrake');

module.exports = {
  initialize: function(api, next){
    api.airbrake = {
      token: api.config.airbrake.token,
      configure: function(){
        api.airbrake.client = airbrakePrototype.createClient(api.airbrake.token);
        api.airbrake.client.handleExceptions(); // catch global uncaught errors
        // api.airbrake.client.developmentEnvironments = []; // don't report in various NODE_ENVs
      },

      notifier: function(err, type, name, objects, severity){
        objects = _.extend({ connection : {} }, objects);
        err.action = name;
        err.component = type;
        err.session = _.pick(objects.connection, 'id', 'fingerprint', 'connectedAt', 'type', 'remotePort', 'remoteIP')
        api.airbrake.client.notify(err, function(err, url){
          if(err){
            console.log('airbrake error ' + err );
          }else{
            console.log('new airbrake log at ' + url );
          }
        });
      }
    };
  },
  
  start: function(api, next){
    if(api.env != 'test'){
      api.airbrake.configure();
      api.exceptionHandlers.reporters.push(api.airbrake.notifier);
    }
    next();
  }
};