

module.exports = app => {
    
    const post = (req, res) => {
        console.log(req.body);
        sql = `INSERT INTO TB_TAGS(OWNER_ID, NAME) VALUES ?`
        parametros = [[req.body.owner_id, req.body.name ]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).send()
        });
    }


    const get = (req, res) => {
        console.log("CARAMBOLA", req.query.owner_id)
        sql = ` SELECT  TAG_ID as id
                        ,NAME as label
                FROM TB_TAGS
                WHERE   OWNER_ID = 1
                        OR OWNER_ID = ?`
        parametros = [[req.query.owner_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).json(results)
        });
    }



    return { post, get }
}