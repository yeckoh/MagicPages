// model in question
const Classes = require('../models/classes.model');

// parent model, for appending Classes:_id to listof_
const Character = require('../models/charas.model');

// import mongoose just to generate a _id: right here, right now
var mongoose = require('mongoose');


module.exports = function(socket) {
    console.log("\x1b[34m"+'ws-loaded:'+"\x1b[0m"+'classes_hooks');

    // // CREATE_ONE
    // socket.on('Make_new_class', function(sent_in_data) {
    //     let newclass = new Class({
    //         _id: mongoose.Types.ObjectId(),
    //         selected_color: "none", // we probably wont use this for classes

    //         class_hitpoints: 0,
    //         class_level: 0,
    //         caster_level: 0,
    //         listof_classspell_list: [],
    //         listof_classfeatures: []
    //       });

    //     Classes.SaveClass(newclass);

    //     /// TODO: supply specification for which listof_classes
    //     Character.AddToListofclassesbyid(sent_in_data.chara_id, newclass._id);

    //     socket.emit('Created_new_class', newclass);
    //     socket.broadcast.in(sent_in_data.chara_id).emit('Created_new_class', newclass);
    // });


    // // READ_ALL
    // socket.on('Get_all_chara_classes', function(sent_in_data) {
    //     // a_promise.then -> do stuff with the data
    //     Classes.GetAllClasses(sent_in_data.classids).then(function(allclasses) {
    //         socket.emit('Read_all_chara_classes', allclasses);
    //         socket.in(sent_in_data.charaid).emit('Read_all_chara_classes', allclasses);
    //     });
    // });

    // UPDATE_ONE
    socket.on('Update_selected_class', function(sent_in_data) {
        Classes.findByIdAndUpdate(sent_in_data.class._id, sent_in_data.class, {new: true}, function(err, updatedClass) {
            socket.emit('Updated_selected_class', updatedClass);
            socket.in(sent_in_data.charaid).emit('Updated_selected_class', updatedClass);
        });
    });

}
