if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('renderPage', function(name) {
		if(typeof name.length == 'undefined'){
    	name = Meteor.Router.page();
  	}
    if (Template[name])
      return new Handlebars.SafeString(Template[name]());
  });
}
  