// model in question
const Feature = require('../models/features.model');

// parent model, for appending Feature:_id to listof_
const Character = require('../models/charas.model');

// import mongoose just to generate a _id: right here, right now
var mongoose = require('mongoose');


module.exports = function(socket) {
    console.log("\x1b[34m"+'ws-loaded:'+"\x1b[0m"+'feature_hooks');

    // when 'make_new_feature' gets fired... CREATE_ONE
    socket.on('Make_new_feature', function(sent_in_data) {
        let newfeature = new Feature({
            _id: mongoose.Types.ObjectId(),
            selected_color: 'rgb(127, 0, 0)',
            feature_category: 0, // user defined feature separation names

            title: 'new feature',
            descript: 'descriptions go here',
            uses: 1,
            uses_left: 1,
            toggleable: false,
            is_enabled: true,
            listof_atks: [],
            listof_saves: [],
            listof_featureprofs: [],
            listof_effects: []
        });

        Feature.SaveFeature(newfeature);

        /// TODO: supply specification for which listof_features
        Character.AddToListoffeaturesbyid(sent_in_data.chara_id, newfeature._id);
        // item features
        // spell features

        socket.emit('Created_new_feature', newfeature, owner);
        socket.broadcast.in(sent_in_data.chara_id).emit('Created_new_feature', newfeature, owner);
    });


    // when get all cahra features gets fired... READ_ALL
    socket.on('Get_all_chara_features', function(sent_in_data) {
        // a_promise.then -> do stuff with the data
        Feature.GetAllFeatures(sent_in_data.featureids).then(function(allFeatures) {
            socket.emit('Read_all_chara_features', allFeatures);
        });
    });

    // when 'update selected feature' gets fired... UPDATE_ONE
    socket.on('Update_selected_feature', function(sent_in_data) {
        Feature.findByIdAndUpdate(sent_in_data.feature._id, sent_in_data.feature, {new: true}, function(err, updatedFeature) {
            socket.emit('Updated_one_feature', updatedFeature); // send back to self, gotta replace list item then set selected to new listitem
            socket.broadcast.in(sent_in_data.charaid).emit('Updated_one_feature', updatedFeature); // make everyone else read_one
        });
    });

}
