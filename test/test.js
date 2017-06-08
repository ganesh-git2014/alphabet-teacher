var bst = require('bespoken-tools')
var chai = require('chai')
var server = null
var alexa = null

beforeEach(function (done) {
  // first param - the location of lambda file to be return
  // second - port
  // third - verbose mode res/req sent to console
  server = new bst.LambdaServer('../index.js', 10000, true)
  // 1st - url of server
  // 2 - IntentSchema
  // utterances
  alexa = new bst.BSTAlexa('http://localhost:10000',
                './speechAssets/IntentSchema.json',
                './speechAssets/Utterances.txt')
  server.start( function() {
    alexa.start(function (error) {
      if (error !== undefined) {
        console.log('Error: ' + error)
      } else {
        done()
      }
    })
  })
})

afterEach(function (done) {
  alexa.stop(function () {
    server.stop(function () {
      done()
    })
  })
})

it('Launches the skill', function (done) {
  // Launch the skill via launch request
  alexa.launched(function (error, payload) {
    if(error) {
      console.log(error)
      done()
    }
    chai.assert.equal(payload.response.outputSpeech.ssml, '<speak>Welcome to Alphabet Teacher. You can have Alexa say the English alphabet back to you.  To start using the skill, say Alexa, ask alphabet teacher to say the alphabet.</speak>')
    chai.assert.equal(payload.response.shouldEndSession, false)
    done()
  })
})


it('Launches the Help intent and doesnt end session', function (done) {
  alexa.intended('AMAZON.HelpIntent', null,  function (error, payload) {
    if (error) {
      console.log(error)
      done()
    }
    chai.assert.equal(payload.response.outputSpeech.ssml, '<speak>Welcome to Alphabet Teacher. The purpose of this skill is to practice the alphabet along with alexa. To Have Alexa say the alphabet please say Alexa, ask alphabet teacher to say the alphabet. What would you like to do?</speak>')
    chai.assert.equal(payload.response.shouldEndSession, false)
    done()
  })
})

it('Stops and Exits Skill upon calling StopIntent', function (done) {
  alexa.intended('AMAZON.StopIntent', null, function (error, payload) {
    if (error) {
      console.log(error)
      done()
    }
    chai.assert.equal(payload.response.outputSpeech.ssml, '<speak>Stopping your Request and Exiting Skill</speak>')
    done()
  })
})

it('Cancels and Exits Skill upon calling CancelIntent', function (done) {
  alexa.intended('AMAZON.CancelIntent', null, function (error, payload) {
    if (error) {
      console.log(error)
      done()
    }
    chai.assert.equal(payload.response.outputSpeech.ssml, '<speak>Canceling your Request and Exiting Skill</speak>')
    done()
  })
})

it('Says the alphabet upon calling AlphabetIntent', function (done) {
  alexa.spoken('to say the alphabet', function (error, response, request) {
    if (error){
      console.log(error)
    }
    chai.assert.equal(request.request.intent.name, 'AlphabetIntent')
  })
  alexa.spoken('to tell me the alphabet', function (error, response, request) {
    if (error){
      console.log(error)
    }
    chai.assert.equal(request.request.intent.name, 'AlphabetIntent')
  })
  alexa.spoken('to recite the alphabet', function (error, response, request) {
    if (error){
      console.log(error)
    }
    chai.assert.equal(request.request.intent.name, 'AlphabetIntent')
  })
  done()
})
