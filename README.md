## notes
- be sure to enable the plugin within actionhero (`config/plugins.js`)
- you will need to add the airbrake package (`npm install airbrake --save`) to your package.json

You can add a deployment drunt task to clear the previous deploy's errors:
```javascript
grunt.registerTask('notifyAirbrakeDeploy','tell airbrake we deployed',function(message){
  var done = this.async()
  init(function(api){
    api.airbrake.configure();
    api.airbrake.client.trackDeployment(function(){
      done();
    })
  })
})
```
