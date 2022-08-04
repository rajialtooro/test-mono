import express from "express";

var app = express();

var word = "looper"

app.get("/guess/:word", function (req, res) {
    var userGuess = req.params.word;
    var result = [];
    for (var i = 0; i < userGuess.length; i++) {
        var ch = userGuess[i]
        if (word.includes(ch)) {
            if (word[i] == ch) {
                result.push(1)
            } else {
                result.push(0)
            }
        } else {
            result.push(-1)
        }
    }
    res.json(result)
})

app.use(express.static('public'));

app.listen(3000, function () {

    console.log("My server running on port 3000")
});