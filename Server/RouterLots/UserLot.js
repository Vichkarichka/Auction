const express = require('express');
const router = express.Router();
const user = require('../DataBase/SQLQueryForLot');
const ob = require('../ErrorObject/Errors');


router.get("/:id", (req, res) => {

    let userId = req.params.id;
    user.getLots(userId).then(async(result)=> {
        const promise = [];
        const mas = [];
        for(let i = 0; i< result.length; i++) {
            promise.push(user.getLotsImage(result[i].idLot));
        }
        for await (const items of promise) {
            mas.push(items);
        }
        for (let i = 0; i < result.length; i++) {
            if (mas[i].length === 0) continue;
            if (result[i].idLot === mas[i][0].idLot) {
                result[i].img = mas[i];
            }
        }
        res.status(201).json({
            result: result,
        });
    }).catch((error) => {
        console.log(error);
        res.status(401).json({
            message: ob.objERRORS.LOT_FORM,
        });
    });
});

module.exports = router;