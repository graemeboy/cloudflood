exports.index = function(req, res)
{

  // Find out if the user has already logged in.
  // If true, then redirect to the user's store page.
  if (req.user) {
    res.redirect("/dashboard");
  }

  res.render('index', { 
  	title: "Welcome to CloudFlood - Let your users pay with tweets",
  	messages: req.flash('login')
  });
};
