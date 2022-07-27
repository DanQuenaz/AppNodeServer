var md5 = require('md5');
const { now } = require('moment');

module.exports = app => {
    
    const new_sheet = (req, res) => {
        console.log(req.body)

        app.db.query(`START TRANSACTION`);

        sql = `INSERT INTO TB_SPREAD_SHEETS(OWNER_ID, NAME, INVITE_CODE, CREATION_DATE) VALUES ?`
        
        invite_code_uncript = req.body.owner_id + req.body.name + now()
        invite_code = md5(invite_code_uncript)
        
        console.log(invite_code_uncript)
        console.log(invite_code)
        
        parametros = [[req.body.owner_id, req.body.name, invite_code, new Date()]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                app.db.query(`ROLLBACK`);
                return res.status(400).json(err);
            }

            console.log(results)

            sql = `INSERT INTO TB_USERS_SHEETS(USER_ID, SPREAD_SHEET_ID) VALUES ?`
            parametros = [[req.body.owner_id, results.insertId]]

            app.db.query(sql, [parametros], (err, results, fields) => {
                if (err) {
                    app.db.query(`ROLLBACK`);
                    return res.status(400).json(err);
                }
                app.db.query(`COMMIT`);
                return res.status(201).send()
            });
        });
    }

    const add_user_sheet = (req, res) => {
        console.log(req.body)

        app.db.query(`START TRANSACTION`);

        sql = ` SELECT SPREAD_SHEET_ID
                FROM TB_SPREAD_SHEETS
                WHERE INVITE_CODE = ?
        `
        parametros = [[req.body.invite_code]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                app.db.query(`ROLLBACK`);
                return res.status(405).json(err);
            }
            console.log(results)
            spread_sheet_id = results[0].SPREAD_SHEET_ID
            sql = ` INSERT INTO TB_USERS_SHEETS(USER_ID, SPREAD_SHEET_ID)
                    VALUES ?
            `
            parametros = [[req.body.user_id, spread_sheet_id]]
            
            app.db.query(sql, [parametros], (err, results, fields) => {
                if (err) {
                    app.db.query(`ROLLBACK`);
                    return res.status(405).json(err);
                }
                
                app.db.query(`COMMIT`);
                return res.status(200).send()
            });
        });
    }

    const del_sheet = (req, res) => {
        console.log(req.body)

        app.db.query(`START TRANSACTION`);

        sql = ` SELECT OWNER_ID
                FROM TB_SPREAD_SHEETS
                WHERE OWNER_ID = ?
        `
        parametros = [[req.body.user_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                app.db.query(`ROLLBACK`);
                return res.status(405).json(err);
            }

            user = results[0]
            if(user){
                sql = ` DELETE 
                        FROM TB_SPREAD_SHEETS 
                        WHERE SPREAD_SHEET_ID = ?`
                parametros = [[req.body.spread_sheet_id]]

                app.db.query(sql, [parametros], (err, results, fields) => {
                    if (err) {
                        app.db.query(`ROLLBACK`);
                        return res.status(405).json(err);
                    }

                    app.db.query(`COMMIT`);
                    return res.status(200).send()
                });
            }else{
                app.db.query(`ROLLBACK`);
                return res.status(401).send("Sem permissão para deletar esta planilha.")
            } 
        });
    }

    const rename_sheet = (req, res) => {
        console.log(req.body)

        app.db.query(`START TRANSACTION`);

        sql = ` SELECT OWNER_ID
                FROM TB_SPREAD_SHEETS
                WHERE OWNER_ID = ?
        `
        parametros = [[req.body.user_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                app.db.query(`ROLLBACK`);
                return res.status(405).json(err);
            }

            user = results[0]
            if(user){
                sql = ` UPDATE TB_SPREAD_SHEETS
                SET NAME = '`+req.body.new_name+`' 
                WHERE SPREAD_SHEET_ID = ?`
                parametros = [[req.body.spread_sheet_id]]

                app.db.query(sql, [parametros], (err, results, fields) => {
                    if (err) {
                        app.db.query(`ROLLBACK`);
                        return res.status(405).json(err);
                    }

                    app.db.query(`COMMIT`);
                    return res.status(200).send()
                });
            }else{
                app.db.query(`ROLLBACK`);
                return res.status(401).send("Sem permissão para alterar esta planilha.")
            } 
        });
    }

    const get_sheets = (req, res) => {
        console.log(req.body)
      
        sql = ` SELECT  TB_SPREAD_SHEETS.SPREAD_SHEET_ID
                        ,TB_SPREAD_SHEETS.NAME
                        ,TB_SPREAD_SHEETS.INVITE_CODE
                        ,TB_SPREAD_SHEETS.CREATION_DATE
                        ,TB_USERS.NICKNAME
                FROM (TB_SPREAD_SHEETS
                    INNER JOIN TB_USERS_SHEETS ON
                            TB_SPREAD_SHEETS.SPREAD_SHEET_ID = TB_USERS_SHEETS.SPREAD_SHEET_ID)
                    INNER JOIN TB_USERS ON
                        TB_SPREAD_SHEETS.OWNER_ID = TB_USERS.USER_ID
                WHERE TB_USERS_SHEETS.USER_ID = ? `
        parametros = [[req.body.user_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
              return err => res.status(400).send('Erro ao executar processo!')
            }
            const sheets = results;
            console.log(sheets)
            
            res.status(200).json(sheets);

          });
    }

    return { new_sheet, get_sheets, del_sheet, add_user_sheet, rename_sheet }
}