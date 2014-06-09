exports.index = function(req, res)
{

  // Find out if the user has already logged in.
  // If true, then redirect to the user's store page.
  if (req.user) {
    res.redirect("/dashboard");
  } else {
   //res.redirect("/try");   
  }

  res.render('prelaunch/beta-try', { 
  	title: "Welcome to CloudFlood - Let your users pay with tweets",
  	error: req.flash('error')
  });
};

exports.beta = function(req, res)
{

  // Find out if the user has already logged in.
  // If true, then redirect to the user's store page.
  if (req.user) {
    res.redirect("/dashboard");
  }

  res.render('prelaunch/beta-try', { 
  	title: "Welcome to CloudFlood - Let your users pay with tweets",
  	error: req.flash('error')
  });
};

exports.vip = function(req, res)
{

  // Find out if the user has already logged in.
  // If true, then redirect to the user's store page.
  if (req.user) {
    res.redirect("/dashboard");
  }

  res.render('prelaunch/vip', { 
  	title: "Welcome to CloudFlood VIP Trial",
  	error: req.flash('error')
  });
};
