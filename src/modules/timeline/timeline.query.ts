export const PAGINATION_INFO_QUERY = `
        WITH ordered_posts AS (
          SELECT
            id,
            show_order_date,
            ROW_NUMBER() OVER (ORDER BY show_order_date ASC) AS row_num,
            COUNT(*) OVER () AS total_posts
          FROM posts
          WHERE user_id = $1
        )
        SELECT row_num, total_posts
        FROM ordered_posts
        WHERE ABS(EXTRACT(EPOCH FROM show_order_date - $2)) = (
          SELECT MIN(ABS(EXTRACT(EPOCH FROM show_order_date - $2)))
          FROM posts
          WHERE user_id = $1
        )
        LIMIT 1
      `;
