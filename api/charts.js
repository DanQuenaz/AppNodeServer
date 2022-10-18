module.exports = app =>{
    const get = (req, res)=>{
        var sql = ``;

        if(req.query.type == "user"){
            sql = `
                SELECT 	tb_users.NICKNAME
                        ,sum(tb_spends.VALUE) AS TOTAL
                FROM tb_spends
                    INNER JOIN tb_users ON
                        tb_spends.OWNER_ID = tb_users.USER_ID
                WHERE 	month(tb_spends.DATE) = ${req.query.month}
                        AND tb_spends.SPREAD_SHEET_ID = ${req.quey.spread_sheet_id}
                GROUP BY tb_users.NICKNAME;
            `;
        }else if(req.query.type == "month"){
            sql = `
                SELECT 	month(tb_spends.DATE)
                        ,sum(tb_spends.VALUE) AS TOTAL
                FROM tb_spends
                WHERE 	date(tb_spends.DATE) >= date_sub(date(now()), INTERVAL 6 MONTH)
                        AND tb_spends.SPREAD_SHEET_ID = ${req.quey.spread_sheet_id}
                GROUP BY month(tb_spends.DATE);
            `; 
        }else if(req.query.type == "tag"){
            sql = `
                SELECT 	tb_tags.NAME
                        ,sum(tb_spends.VALUE) AS TOTAL
                FROM tb_spends
                    INNER JOIN tb_tags ON
                        tb_spends.TAG_ID = tb_tags.TAG_ID
                WHERE 	month(tb_spends.DATE) = ${req.query.month}
                        AND tb_spends.SPREAD_SHEET_ID = ${req.quey.spread_sheet_id}
                GROUP BY tb_tags.NAME;
            `;
        }

        parametros = [[req.query.spread_sheet_id]];

        app.db.query(sql, [parametros], (err, results) =>{
            if(err){
                return res.status(405).send('Erro ao executar processo!');
            }
            res.status(200).json(results);
        });
    };

    return {get};
}