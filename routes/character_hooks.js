// model in question
const Character = require('../models/charas.model');

// parent model, for appending Character:_id to listof_
const User = require('../models/user.model');

// import mongoose just to generate a _id: right here, right now
var mongoose = require('mongoose');

module.exports = function(socket) {
    console.log("\x1b[34m"+'ws-loaded:'+"\x1b[0m"+'character_hooks');

    // CREATE_ONE
    socket.on('Make_new_chara', function(sent_in_data) {

        let newchara = new Character( {
            _id: mongoose.Types.ObjectId(),
            selected_color: 'none',
            feature_category0:'none', // user defined feature separation names
            feature_category1:'none',
            feature_category2:'none',
            feature_category3:'none',
            
            current_hitpoints: 0,
            deathsaves: 0,

            stats:{
                str: 10,
                dex: 10,
                con: 10,
                int: 10,
                wis: 10,
                cha: 10,
                NatAC: 10,
                total_AC: 10,
                total_speed: 0,
                total_hitpoints: 0,
                // total_hitdice: 0, <-- potentially separate into its own model
                total_lvl: 0,
                total_proficiencybonus: 1,
                total_casterlvl: 0
            },

            spellslots: {
                first: 0,
                second: 0,
                third: 0,
                fourth: 0,
                fifth: 0,
                sixth: 0,
                seventh: 0,
                eighth: 0,
                ninth: 0
            },

            persona: {
                name: sent_in_data.name,
                gender: sent_in_data.gender,
                description: undefined,
                personality: undefined,
                ideals: undefined,
                bonds: undefined,
                race: {
                    actualrace: sent_in_data.race,
                    listof_racefeatures: [],
                    racespelllist: undefined
                },
                background: {
                    actualbackground: undefined,
                    listof_backgroundfeatures: []
                }
            },

            skills: undefined,

            listof_characlass: [],
            listof_charainventorylist: [],
            listof_charamanualfeatures: [],

            special_stuff: {
                superiority_dice: 0,
                expertise_dice: 0,
                sorcery_points: 0,
                ki_points: 0,
                rage_dmg: 0,
                other_name: 'user_defined',
                other_number: 0
            }
        });


        // save new character
        Character.SaveCharacter(newchara);

        // update user, append id to listof_charas
        User.AddToListofbyid(sent_in_data.userid, newchara.id);

        socket.emit('Made_new_chara', newchara); // send back to client who called
        socket.broadcast.in(sent_in_data.userid).emit('Made_new_chara', newchara); // send to all in the room but the caller
        


    });

    // READ_ALL
    /// TODO: pull names and ids only to save on data transfers
    socket.on('Get_all_user_charas', function(sent_in_data) {
        // a_promise.then -> do stuff with the data
        Character.GetAllCharacters(sent_in_data.characterids).then(function(allcharacters) {
            socket.emit('Read_all_user_charas', allcharacters); // send to to caller
        });
    });

    // READ_ONE
    socket.on('Get_selected_chara', function(sent_in_data) {
        Character.GetOneCharacter(sent_in_data.characterid).then(function(singlechara) {
            socket.emit('Read_one_chara', singlechara); // send to caller
        });
    });

    // UPDATE_ONE
    socket.on('Update_selected_chara', function(sent_in_data) {
        Character.UpdateOneCharacter(sent_in_data.chara);
        /// TODO: after sidenav only reads charaname and id, update charaname only below
        socket.broadcast.in(sent_in_data.userid).emit('Updated_one_chara', sent_in_data.chara); // send to all same user
        socket.broadcast.in(sent_in_data.chara._id).emit('Read_one_chara', sent_in_data.chara); // send to all who's viewing this chara
    });



}











// socket.emit('wemakenewcharacternow', sent_in_data); // send back to client who called
// socket.broadcast.emit('wemakenewcharacternow', sent_in_data); // send to everyone but the caller