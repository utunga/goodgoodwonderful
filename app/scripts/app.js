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
      .otherwise({
        redirectTo: '/'
      });
  });

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

app.controller('SkillChoiceCtrl', function ($scope, $rootScope, $location) {
  
  $scope.available_skills = 
  {
    "computer": {prefix: "computer", name: "Computer"},
    "garden": {prefix: "garden", name: "Gardening"},
    "music": {prefix: "music", name: "Music"},
    "office": {prefix: "office", name: "Computer"},
    "diy": {prefix: "diy", name: "Home handiwork"},
    "cooking": {prefix: "cooking", name: "Cooking"},
    "painting": {prefix: "painting", name: "Painting"}
  }

  $scope.next = function() {
    $location.path("feed");
  }

  if (!$rootScope.user)  $rootScope.user = {};

  $rootScope.user.skills = []

  function hasSkill(skill_to_find) {
    var found = false;
    _.each($scope.user.skills, function(skill_key) {
      if (skill_to_find==skill_key) {
        found=true;
      }
    });
    return found;
  }

  function toggle(skill_key) {
    var currentSkills = $rootScope.user.skills;
    if (hasSkill(skill_key)) {
       currentSkills  = _.without(skill_key);
    }
    else {
      currentSkills  = _.union(currentSkills, skill_key);
    }
     $rootScope.user.skills= currentSkills;
  }

  $scope.hasSkill = hasSkill;
  $scope.toggle = toggle;
});

app.controller('FeedCtrl', function ($scope, $rootScope, $location) {
  
  $scope.feed = 
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
    msg:"Thanks Mona for helping with the car!",
    skills: ["auto"]
  },
  {
    type:"new_member",
    from:"Sue",
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

});