/**
 * PlayersController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {

    /* e.g.
sayHello: function (req, res) {
res.send('hello world!');
}
*/
    home: function(req, res) {
        res.view();
    },

    create: function(req, res) {

        var nickname = req.param("nickname")

        Players.findOne({nickname : nickname}).done(function(err, player) {
            
            if(err || player) {
                res.json({err : "Ce nom est déjà pris désolé. Veuillez en choisir un autre."});
                return;
            }
            console.log(req.socket.id);
            Players.create({nickname : nickname, socketId : req.socket.id}).done(function(err, player) {
                
                if(err) {
                    res.json({err : "Une erreur est survenu à la connexion de l'utilisateur"});
                    return;
                }

                if (req.isSocket) {
                    res.json({
                        valid: "message reçu",
                        player : player
                    });
                }

            });


        });



    }


};