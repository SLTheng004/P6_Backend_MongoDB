const Sauce = require('../models/sauce');
const fs = require('fs');

//displays all sauces available
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//creates sauce for user
exports.createSauce = (req, res, next) => {

    const url = req.protocol + '://' + req.get('host');
    console.log(url);
    req.body.sauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat 
    });
    console.log(sauce);
    sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'Sauce Successfully Created!'
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
};

//allows user to pull up specific sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//allows user to modify sauce information, as long as user id matches
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
        _id: req.params.id,
        name: req.body.sauce.title,
        maufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        userId: req.body.sauce.userId,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: req.body.sauce.userLiked,
        usersDisliked: req.body.sauce.userDisliked,
        };
    } else {
        sauce = {
            _id: req.params.id,
            name: req.body.title,
            maufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            userId: req.body.userId,
            heat: req.body.heat,
        };
    }
    Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
              message: 'Sauce updated successfully!'
            });
          }
    ).catch(
        (error) => {
            res.status(400).json({
              error: error
            });
        }
    );
};

//allows user to delete sauce and removes file, as long as user id matches
exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() =>
              res.status(200).json({ message: "Sauce has been deleted!" })
            )
            .catch((error) => res.status(400).json({ error }));
        });
        if (!sauce) {
          res.status(404).json({ 
            error: error 
            });
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(400).json;
        }
        ({ error: new Error("Unauthorized request!") });
      })
      .catch((error) => res.status(500).json({ error }));
  };

//user can like or dislike sauce, but can only opt for one option
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // If  the user likes sauce
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "The sauce was liked!" }))
          .catch((error) => res.status(404).json({ error }));
      }

      // If the user wants to remove their like
      if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "The sauce was unliked!" }))
          .catch((error) => res.status(404).json({ error }));
      }

      // If  the user wants to dislike sauce
      if (
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() =>
            res.status(201).json({ message: "The sauce was Disliked" })
          )
          .catch((error) => res.status(404).json({ error }));
      }
      // If the user wants to remove their Dislike

      if (
        sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() =>
            res.status(201).json({ message: "The sauce was Undisliked" })
          )
          .catch((error) => res.status(404).json({ error }));
      }

    })
    .catch((error) => res.status(500).json({ error }));
};
