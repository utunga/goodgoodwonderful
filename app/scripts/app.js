'use strict';

var app = angular.module('skillfabricApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SignInCtrl'
      })
      .when('/thanks', {
        templateUrl: 'views/thanks.html',
        controller: 'ThanksCtrl'
      })
      .when('/skills_choice', {
        templateUrl: 'views/skills_choice.html',
        controller: 'SkillChoiceCtrl'
      })
      .when('/feed', {
        templateUrl: 'views/feed.html',
        controller: 'FeedCtrl'
      })
      .when('/post_request', {
        templateUrl: 'views/post_request.html',
        controller: 'PostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run(function($rootScope) {
  $rootScope.user = {
    name: "Pepper",
    profile_img: "pepper"
  }


  var initData = 
  [{
    type:"request",
    from:"rohana",
    profile_img:"rohana",
    msg:"Can anyone come next tuesday for a working bee in my Garden please?", 
    skills: ["garden", "diy"]
  },
  {
    type:"acknowledgement",
    from:"Joe",
    to:"Mona",
    profile_img:"joe",
    hrs: 2,
    msg:"Thanks Mona for helping with the car!",
    skills: ["auto"]
  },
  {
    type:"new_member",
    from:"Sue", 
    organisation: "Kapiti Timebank",
    profile_img:"sue",
    skills: ["auto","garden","office","diy"]
  },
  {
    type:"request",
    from:"rich",
    profile_img:"rich",
    msg:"Hey I need something and I'm annoying.", 
    skills: ["garden", "diy"]
  },
  {
    type:"comment",
    from:"Sue",
    profile_img:"sue",
    msg:"Hey everyone it's great to be on here.. Let me know if I am doing this right?"
  }]

  $rootScope.feed = initData;
})

app.controller('MainCtrl', function ($scope, $rootScope, $location) {
  $scope.next = function() {
    $location.path("thanks");
  }
});

app.controller('ThanksCtrl', function ($scope, $rootScope, $location) {
  $scope.next = function() {
    $location.path("signin");
  }
});


app.controller('SignInCtrl', function ($scope, $rootScope, $location) {
  $scope.next = function() {
    $rootScope.user =
      { name: "Joe" }
    $location.path("skills_choice");
  }

  $scope.loginForm = function() {
    $rootScope.user = { name: $scope.email }
    $location.path("skills_choice");
  }
});



app.controller('PostCtrl', function ($scope, $rootScope, $location) {
  
  $scope.available_skills = 
  {
    "computer": {prefix: "computer", name: "Computer"},
    "garden": {prefix: "garden", name: "Gardening"},
    "music": {prefix: "music", name: "Music"},
    "office": {prefix: "office", name: "Office Work"},
    "diy": {prefix: "diy", name: "Home DIY"},
    "cooking": {prefix: "cooking", name: "Cooking"},
    "painting": {prefix: "painting", name: "Painting"}
  }

  $scope.next = function() {
    $location.path("feed");
  }


  $scope.skills = []

  function hasSkill(skill_to_find) {
    var found = false;
    _.each($scope.skills, function(skill_key) {
      if (skill_to_find==skill_key) {
        found=true;
      }
    });
    return found;
  }

  function toggle(skill_key) {
    var currentSkills = $scope.skills;
    if (hasSkill(skill_key)) {
       currentSkills  = _.without(currentSkills,skill_key);
    }
    else {
      currentSkills  = _.union(currentSkills, skill_key);
    }
    $scope.skills= currentSkills;
  }

  function postRequest() {
    var msg = $scope.msg;
    var skills = $scope.skills;
    var new_request = 
    {
      type:"request",
      from: $rootScope.user.name,
      profile_img: $rootScope.user.profile_img,
      msg: msg, 
      skills: skills
    };

    $rootScope.feed = _.union($rootScope.feed, new_request,[0]);
    $location.path("feed");
  }

  $scope.postRequest = postRequest;
  $scope.hasSkill = hasSkill;
  $scope.toggle = toggle;
});



app.controller('NavCtrl', function ($scope, $rootScope, $location) {
  $scope.goto = function(page) {
    $location.path(page);
  }

  $scope.search = function() {
      $rootScope.$broadcast('searchEvt', $scope.query); 
  };

});


app.controller('FeedCtrl', function ($scope, $rootScope, $filter, $location) {

 var searchMatch = function (haystack, needle) {
      if (!haystack)
        return false;
      if (!needle) {
          return true;
      }
      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
  };

  $scope.$on('searchEvt', function(event, query) {
    var allData = $rootScope.feed;
    $scope.feed  = $filter('filter')(allData, function (post) {
        if (searchMatch(post.from, query)) return true;
        if (searchMatch(post.msg, query)) return true;
        if (_.any(post.skills, function(skill) { return searchMatch(skill, query); })) return true;
        return false;
    });

  });


});