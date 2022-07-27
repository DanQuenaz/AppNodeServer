

module.exports = app => {
    
    const put = (req, res) => {
        console.log(req.body)
        sql = `INSERT INTO TB_SPENDS(OWNER_ID, SPREAD_SHEET_ID, TAG_ID, DESCRIPTION, VALUE, DATE) VALUES ?`
        parametros = [[req.body.owner_id, req.body.spread_sheet_id, req.body.tag_id, req.body.description, req.body.value, 'NOW()']]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).send()
        });
    }


    const get = (req, res) => {
        console.log(req.body)
        sql = `SELECT   TB_USERS.NICKNAME
                        ,TB_SPREAD_SHEETS.NAME
                        ,TB_TAGS.NAME
                        ,TB_SPENDS.DESCRIPTION
                        ,TB_SPENDS.VALUE
                        ,TB_SPENDS.DATE
                FROM TB_SPENDS
                    INNER JOIN TB_SPREAD_SHEETS ON
                        TB_SPENDS.SPREAD_SHEET_ID = TB_SPREAD_SHEETS.SPREAD_SHEET_ID
                    INNER JOIN TB_USERS ON
                        TB_SPENDS.OWNER_ID = TB_USERS.USER_ID
                    INNER JOIN TB_TAGS ON
                        TB_SPENDS.TAG_ID = TB_TAGS.TAG_ID
                    WHERE TB_SPENDS.SPREAD_SHEET_ID = ?`
        parametros = [[req.body.owner_id, req.body.spread_sheet_id, req.body.tag_id, req.body.description, req.body.value, 'NOW()']]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).json(results)
        });
    }



    return { put, get }
}