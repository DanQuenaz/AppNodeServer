const { application } = require('express');
const moment = require('moment');

module.exports = app => {
    const post = (req, res) => {
        moment.locale('pt-br');
        
        // console.log("BODY ", req.body);
        sql = `INSERT INTO TB_SPENDS(OWNER_ID, SPREAD_SHEET_ID, TAG_ID, DESCRIPTION, VALUE, CLOSED, FIXED, DATE) VALUES ?`
        parametros = [[req.body.owner_id, req.body.spread_sheet_id, req.body.tag_id, req.body.description, req.body.value, 0, req.body.fixed, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            sql = ` SELECT USER_ID
                    FROM TB_USERS_SHEETS
                    WHERE   USER_ID != ${req.body.owner_id}
                            AND SPREAD_SHEET_ID = ?
                `
            parametros = [[req.body.spread_sheet_id]]

            app.db.query(sql, [parametros], (err, results, fields) => {
                if (err) {
                    // return err => res.status(400).json(err);
                };
                const users_keys = []
                results.forEach(element => {
                    users_keys.push(element.USER_ID+'')
                });

                sql = ` SELECT NICKNAME
                        FROM TB_USERS
                        WHERE USER_ID = ?
                `
                parametros = [[req.body.owner_id]]
                app.db.query(sql, [parametros], (err, results, fields) => {
                    if (err) {
                        // return err => res.status(400).json(err);
                    };
                    
                    var stringNotification = `${results[0].NICKNAME} cadastrou ${req.body.description} - R$ ${req.body.value}`
                    app.api.onesignal.notification_user(users_keys, stringNotification);
    
                });
             

            });

            return res.status(200).send()
        });
    }


    const get = (req, res) => {
        // console.log("QUERY " + req.query.spread_sheet_id)
        sql = `SELECT   TB_SPENDS.SPEND_ID
                        ,TB_USERS.NICKNAME
                        ,TB_SPREAD_SHEETS.NAME
                        ,TB_TAGS.NAME
                        ,TB_SPENDS.DESCRIPTION
                        ,TB_SPENDS.VALUE
                        ,TB_SPENDS.DATE
                        ,TB_SPENDS.FIXED
                        ,TB_SPENDS.TAG_ID
                        ,TB_SPENDS.OWNER_ID
                FROM TB_SPENDS
                    INNER JOIN TB_SPREAD_SHEETS ON
                        TB_SPENDS.SPREAD_SHEET_ID = TB_SPREAD_SHEETS.SPREAD_SHEET_ID
                    INNER JOIN TB_USERS ON
                        TB_SPENDS.OWNER_ID = TB_USERS.USER_ID
                    INNER JOIN TB_TAGS ON
                        TB_SPENDS.TAG_ID = TB_TAGS.TAG_ID
                    WHERE   TB_SPENDS.CLOSED = 0
                            AND TB_SPENDS.SPREAD_SHEET_ID = ?
                    ORDER BY TB_SPENDS.DATE DESC`
        parametros = [[req.query.spread_sheet_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).json(results)
        });
    };

    const del = (req, res) => {
        sql = `
            DELETE FROM TB_SPENDS
            WHERE SPEND_ID = ?
        `;
        parametros = [[req.query.spend_id]];
        // console.log(sql)
        app.db.query(sql, [parametros], (err, results, fields)=>{
            if(err){
                return err=>res.status(400).json(err);
            }
            return res.status(200).send("Despesa deletada.")
        });
    };

    const edit = (req, res) => {
        
        sql = `
            UPDATE TB_SPENDS
            SET DESCRIPTION = '${req.body.description}',
                VALUE = ${req.body.value},
                FIXED = ${req.body.fixed},
                TAG_ID = ${req.body.tag_id},
                DATE = '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
            WHERE SPEND_ID = ?

        `;
        // console.log(req.body, sql)
        parametros = [[req.body.spend_id]];
        app.db.query(sql, [parametros], (err, results, fields)=>{
            if(err){
                return err=>res.status(400).json(err);
            }
            return res.status(200).send("Despesa atualizada.")
        });
    };



    return { post, get, del, edit }
}