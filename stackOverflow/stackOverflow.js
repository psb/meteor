Questions = new Meteor.Collection("questions");
Answers = new Meteor.Collection("answers");
if (Meteor.isClient) {

  Template.allQuestions.questions = function(){
    return Questions.find({}, {sort: {date: -1}});
  };

  Template.single_question.answers = function(){
    return Answers.find({questionId: this._id}, {sort: {date: 1}});
  };

  Template.single_question.selected = function () {
    return Session.equals("selected_question", this._id) ? "selected" : '';
  };

  Template.user.user = function(){
    return Session.get('user');
  };
  
  Template.askQuestion.events({
    'click input.ask' : function () {
      var newQuestion = document.getElementById('questionBox').value;
      Questions.insert({user: Session.get('user'), date: new Date(), question : newQuestion});
      document.getElementById("questionBox").value = '';
    }
  });

  Template.single_question.events({
    'click': function () {
      Session.set("selected_question", this._id);
    }
  });

  Template.new_answer.events({
    'click input.submit' : function () {
      var question = Session.get("selected_question");
      var text = document.getElementById(question).value;
      Answers.insert({
        questionId: question,
        user: Session.get("user"),
        date: new Date(),
        answerText: text,
        score: 0
      });
      document.getElementById(question).value = '';
    }
  });

  Template.user.events = {
    'click input.login': function () {
      var user = document.getElementById("user-login").value;
      Session.set("user", user);
    }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Questions.find().count() === 0) {
      Questions.insert({user: "Sgt. Bonertown", date: new Date(), question: "Why is my name Sgt. Bonertown?"});
      Questions.insert({user: "Captain Whitaker", date: new Date(), question: "Whats for dinner?"});
      Questions.insert({user: "General Bacchus", date: new Date(), question: "Whats the temp in Maurutania?"});
    }
  });
}
