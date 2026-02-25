const { stat } = require("fs/promises");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

class Ai {
  static async create(data) {
    const { phone, email, firstname, lastname, password, photourl } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (phone, email, firstname, lastname, password, photourl, is_email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        phone,
        email,
        firstname,
        lastname,
        hashedPassword,
        photourl || null, // default to null if photourl not provided
        0,
      ]
    );

    return result.rows[0];
  }

  static async update(userId, updates) {
    const {
      email,
      firstname,
      lastname,
      gender,
      password,
      location,
      street,
      zip_code,
      lat,
      lon,
      referred_by,
      website,
    } = updates;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const result = await pool.query(
      `UPDATE users 
       SET email = COALESCE($1, email),
           firstname = COALESCE($2, firstname),
           lastname = COALESCE($3, lastname),
           gender = COALESCE($4, gender),
           password = COALESCE($5, password),
           location = COALESCE($6, location),
           street = COALESCE($7, street),
           zip_code = COALESCE($8, zip_code),
           lat = COALESCE($9, lat),
           lon = COALESCE($10, lon),
           referred_by = COALESCE($11, referred_by),
           website = COALESCE($12, website)
       WHERE id = $13 RETURNING *`,
      [
        email,
        firstname,
        lastname,
        gender,
        hashedPassword,
        location,
        street,
        zip_code,
        lat,
        lon,
        referred_by,
        website,
        userId,
      ]
    );
    return result.rows[0];
  }

  static async findByPhone(phone) {
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async checkUserExist(phone, email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE phone = $1 OR email = $2",
      [phone, email]
    );
    return result.rows[0];
  }

  // static async storeRefreshToken(token) {
  //   const result = await pool.query(
  //     "INSERT INTO refreshtoken (token) VALUES ($1) RETURNING token",
  //     [token]
  //   );
  //   return result.rows[0];
  // }
  static async storeRefreshToken(userId, token) {
    const result = await pool.query(
      `INSERT INTO refreshtoken (user_id, token, created_at)
       VALUES ($1, $2, NOW())
       RETURNING token`,
      [userId, token]
    );
    return result.rows[0];
  }

  static async getRefreshToken(token) {
    const result = await pool.query(
      "SELECT * FROM refreshtoken WHERE token = $1",
      [token]
    );
    return result.rows[0];
  }

  static async resetPassword(userId, password) {
    const result = await pool.query(
      `UPDATE users 
       SET password = COALESCE($1, password)
       WHERE id = $2 RETURNING *`,
      [password, userId]
    );
    return result.rows[0];
  }

  static async changeNotificationType(userId, type) {
    const result = await pool.query(
      `UPDATE users 
       SET notification_type = COALESCE($1, notification_type)
       WHERE id = $2 RETURNING *`,
      [type, userId]
    );
    return result.rows[0];
  }

  static async changeAppearanceMode(userId, mode) {
    const result = await pool.query(
      `UPDATE users 
       SET appearance_mode = COALESCE($1, appearance_mode)
       WHERE id = $2 RETURNING *`,
      [mode, userId]
    );
    return result.rows[0];
  }

  /*  static async getProfileByUserId(id) {
    const result = await pool.query(
        `
        SELECT 
          users.*,

          JSON_AGG(
              JSON_BUILD_OBJECT(
                  'description', skills.description,
                  'skill_type', skills.skill_type,
                  'experience_level', skills.experience_level,
                  'hourly_rate', skills.hourly_rate
              )
          ) FILTER (WHERE skills.id IS NOT NULL) AS skills,

          COALESCE(account.spark_token_balance, 0) AS spark_token_balance,
          COALESCE(account.cash_balance, 0) AS cash_balance,

          (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS total_followers,
          (SELECT COUNT(*) FROM follows WHERE follows.follower_id = users.id) AS total_following
      FROM users
      LEFT JOIN skills ON users.id = skills.user_id
      LEFT JOIN account ON users.id = account.user_id
      WHERE users.id = $1
      GROUP BY 
        users.id, 
        account.spark_token_balance, 
        account.cash_balance;
        `,
        [id]
    );
    return result.rows;
  } */

  // static async getProfileByUserId(id) {
  //   const result = await pool.query(
  //       `
  //       SELECT
  //           users.*,

  //           COALESCE(
  //               JSON_AGG(
  //                   JSON_BUILD_OBJECT(
  //                       'skill_id', skills.id,
  //                       'description', skills.description,
  //                       'skill_type', skills.skill_type,
  //                       'experience_level', skills.experience_level,
  //                       'hourly_rate', skills.hourly_rate,
  //                       'thumbnail01', skills.thumbnail01,
  //                       'thumbnail02', skills.thumbnail02,
  //                       'thumbnail03', skills.thumbnail03,
  //                       'thumbnail04', skills.thumbnail04
  //                   )
  //               ) FILTER (WHERE skills.id IS NOT NULL),
  //               '[]'
  //           ) AS skills,

  //           COALESCE(account.spark_token_balance, 0) AS spark_token_balance,
  //           COALESCE(account.cash_balance, 0) AS cash_balance,

  //           (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS total_followers,
  //           (SELECT COUNT(*) FROM follows WHERE follows.follower_id = users.id) AS total_following

  //       FROM users
  //       LEFT JOIN skills ON users.id = skills.user_id
  //       LEFT JOIN account ON users.id = account.user_id
  //       WHERE users.id = $1

  //       GROUP BY users.id, account.spark_token_balance, account.cash_balance;
  //       `,
  //       [id]
  //   );
  //   return result.rows;
  // }

  // static async getProfileByUserId(id) {
  //   const result = await pool.query(
  //     `
  //     SELECT
  //         users.id, users.phone, users.email, users.firstname, users.lastname,
  //         users.gender, users.notification_type, users.appearance_mode,
  //         users.photourl, users.bio, users.location, users.street, users.zip_code,
  //         users.created_at, users.updated_at, users.referral_code, users.website,

  //         COALESCE(
  //             JSON_AGG(
  //                 JSON_BUILD_OBJECT(
  //                     'skill_id', skills.id,
  //                     'description', skills.description,
  //                     'skill_type', skills.skill_type,
  //                     'spark_token', skills.spark_token,
  //                     'experience_level', skills.experience_level,
  //                     'hourly_rate', skills.hourly_rate,
  //                     'thumbnail01', skills.thumbnail01,
  //                     'thumbnail02', skills.thumbnail02,
  //                     'thumbnail03', skills.thumbnail03,
  //                     'thumbnail04', skills.thumbnail04
  //                 )
  //             ) FILTER (WHERE skills.id IS NOT NULL),
  //             '[]'
  //         ) AS skills,

  //         COALESCE(account.spark_token_balance, 0) AS spark_token_balance,
  //         COALESCE(account.cash_balance, 0) AS cash_balance,

  //         (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS total_followers,
  //         (SELECT COUNT(*) FROM follows WHERE follows.follower_id = users.id) AS total_following

  //     FROM users
  //     LEFT JOIN skills ON users.id = skills.user_id
  //     LEFT JOIN account ON users.id = account.user_id
  //     WHERE users.id = $1

  //     GROUP BY users.id, users.phone, users.email, users.firstname, users.lastname,
  //              users.gender, users.notification_type, users.appearance_mode,
  //              users.photourl, users.bio, users.location, users.street, users.zip_code,
  //              users.created_at, users.updated_at, users.referral_code, users.website,
  //              account.spark_token_balance, account.cash_balance;
  //     `,
  //     [id]
  //   );
  //   return result.rows;
  // }
  static async getProfileByUserId(id) {
    const result = await pool.query(
      `
      SELECT 
          users.id, users.phone, users.email, users.firstname, users.lastname, 
       
          users.photourl, 
          users.created_at, users.updated_at
  
         
  
      FROM users
    
      WHERE users.id = $1
  
      GROUP BY users.id, users.phone, users.email, users.firstname, users.lastname, 
            
               users.photourl, 
               users.created_at, users.updated_at
      `,
      [id]
    );
    return result.rows;
  }

  // static async getProfileByUserName(name) {
  //   const result = await pool.query(
  //     `
  //       SELECT
  //           users.*,

  //           COALESCE(
  //               JSON_AGG(
  //                   JSON_BUILD_OBJECT(
  //                       'skill_id', skills.id,
  //                       'description', skills.description,
  //                       'skill_type', skills.skill_type,
  //                       'experience_level', skills.experience_level,
  //                       'hourly_rate', skills.hourly_rate,
  //                       'thumbnail01', skills.thumbnail01,
  //                       'thumbnail02', skills.thumbnail02,
  //                       'thumbnail03', skills.thumbnail03,
  //                       'thumbnail04', skills.thumbnail04
  //                   )
  //               ) FILTER (WHERE skills.id IS NOT NULL),
  //               '[]'
  //           ) AS skills,

  //           COALESCE(account.spark_token_balance, 0) AS spark_token_balance,
  //           COALESCE(account.cash_balance, 0) AS cash_balance,

  //           (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS total_followers,
  //           (SELECT COUNT(*) FROM follows WHERE follows.follower_id = users.id) AS total_following

  //       FROM users
  //       LEFT JOIN skills ON users.id = skills.user_id
  //       LEFT JOIN account ON users.id = account.user_id
  //       WHERE (users.firstname || ' ' || users.lastname) ILIKE $1

  //       GROUP BY users.id, account.spark_token_balance, account.cash_balance;
  //       `,
  //     [`%${name}%`]
  //   );
  //   return result.rows;
  // }
  static async getProfileByUserName(name) {
    const result = await pool.query(
      `
        SELECT 
            users.id, users.firstname, users.lastname, users.email, users.phone, 
            users.bio, users.location, users.photourl, users.created_at, users.updated_at, 

            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'skill_id', skills.id,
                        'description', skills.description,
                        'skill_type', skills.skill_type,
                        'spark_token', skills.spark_token,
                        'experience_level', skills.experience_level,
                        'hourly_rate', skills.hourly_rate,
                        'thumbnail01', skills.thumbnail01,
                        'thumbnail02', skills.thumbnail02,
                        'thumbnail03', skills.thumbnail03,
                        'thumbnail04', skills.thumbnail04
                    )
                ) FILTER (WHERE skills.id IS NOT NULL), 
                '[]'
            ) AS skills,

            COALESCE(account.spark_token_balance, 0) AS spark_token_balance,
            COALESCE(account.cash_balance, 0) AS cash_balance,

            (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS total_followers,
            (SELECT COUNT(*) FROM follows WHERE follows.follower_id = users.id) AS total_following

        FROM users
        LEFT JOIN skills ON users.id = skills.user_id
        LEFT JOIN account ON users.id = account.user_id
        WHERE (users.firstname || ' ' || users.lastname) ILIKE $1 

        GROUP BY users.id, users.firstname, users.lastname, users.email, users.phone, 
                 users.bio, users.location, users.photourl, users.created_at, users.updated_at,
                 account.spark_token_balance, account.cash_balance;
        `,
      [`%${name}%`]
    );
    return result.rows;
  }

  static async changeAvatar(userId, filepath) {
    const result = await pool.query(
      `UPDATE users 
      SET photourl = COALESCE($1, photourl)
      WHERE id = $2 RETURNING *`,
      [filepath, userId]
    );
    return result.rows[0];
  }

  static async updateBio(userId, data) {
    const { bio, location, street, zip_code, lon, lat, user } = data;

    const result = await pool.query(
      `UPDATE users 
      SET bio = COALESCE($1, bio),
          location = COALESCE($2, location),
          street = COALESCE($3, street),
          zip_code = COALESCE($4, zip_code),
          lon = COALESCE($5, lon),
          lat = COALESCE($6, lat)
      WHERE id = $7 RETURNING *`,
      [bio, location, street, zip_code, lon, lat, user]
    );
    return result.rows[0];
  }

  static async verifyEmail(email, code) {
    const result = await pool.query(
      "SELECT * FROM verifyemail WHERE email = $1 AND token = $2",
      [email, code]
    );
    return result.rows[0];
  }

  static async insertVerificationCode(email, code) {
    const result = await pool.query(
      "INSERT INTO verifyemail (email, token) VALUES ($1,$2) RETURNING *",
      [email, code]
    );
    return result.rows[0];
  }

  static async updateVerificationCode(email, code) {
    const result = await pool.query(
      `UPDATE verifyemail 
      SET token = $1
      WHERE email = $2 RETURNING *`,
      [code, email]
    );
    return result.rows[0];
  }

  static async updateVerificationStatus(email, status) {
    const result = await pool.query(
      `UPDATE users 
      SET is_email_verified = $1
      WHERE email = $2 RETURNING *`,
      [status, email]
    );
    return result.rows[0];
  }

  static async checkVerificationExist(email) {
    const result = await pool.query(
      "SELECT * FROM verifyemail WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  static async deleteUser(email) {
    const result = await pool.query(
      `DELETE FROM users 
        WHERE email = $1 
        RETURNING *`,
      [email]
    );

    return result.rows[0];
  }

  static async updateCordinates(lat, lng, radius, date, userId) {
    const result = await pool.query(
      `UPDATE users 
      SET lat = COALESCE($1, lat),
      lon = COALESCE($2, lon),
      radius = COALESCE($3, radius),
      location_updated_at = COALESCE($4, location_updated_at)
      WHERE id = $5 RETURNING *`,
      [lat, lng, radius, date, userId]
    );
    return result.rows[0];
  }

  static async findNearbyUsers(lat, lon, radius = 5) {
    const result = await pool.query(
      `SELECT id, firstname, lastname, lat, lon, email, phone, gender, photourl,
        (
          6371 * acos(
            LEAST(GREATEST(
              cos(radians($1)) * cos(radians(lat)) *
              cos(radians(lon) - radians($2)) +
              sin(radians($1)) * sin(radians(lat))
            , -1), 1)
          )
        ) AS distance
      FROM users
      WHERE (
        6371 * acos(
          LEAST(GREATEST(
            cos(radians($1)) * cos(radians(lat)) *
            cos(radians(lon) - radians($2)) +
            sin(radians($1)) * sin(radians(lat))
          , -1), 1)
        )
      ) <= $3
      ORDER BY distance;
      `,
      [lat, lon, radius]
    );

    return result.rows;
  }

  static async findNearbyUsersByAddress(address) {
    const result = await pool.query(
      `
        SELECT 
          users.id, firstname, lastname, lat, lon, email, phone, gender, photourl
        FROM users 
        WHERE location ILIKE $1
        OR street ILIKE $1
        `,
      [`%${address}%`]
    );
    return result.rows;
  }

  static async getAllusers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  static async setReferralCode(userId, code) {
    const result = await pool.query(
      `UPDATE users 
      SET referral_code = COALESCE($1, referral_code)
      WHERE id = $2 RETURNING *`,
      [code, userId]
    );
    return result.rows[0];
  }

  static async getUsersByReferralCode(code) {
    const result = await pool.query(
      "SELECT * FROM users WHERE referred_by = $1",
      [code]
    );
    return result.rows[0];
  }

  static async storeResetPasswordToken(userId, token) {
    const result = await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '1 hour') RETURNING token",
      [userId, token]
    );
    return result.rows[0];
  }

  static async getPasswordResetTokens(token, userId) {
    const result = await pool.query(
      "SELECT * FROM password_reset_tokens WHERE token = $1 AND user_id = $2",
      [token, userId]
    );
    return result.rows[0];
  }

  static async deletePasswordResetTokens(token) {
    const result = await pool.query(
      `DELETE FROM password_reset_tokens 
        WHERE token = $1`,
      [token]
    );

    return result.rows[0];
  }

  static async getUserNotifications(userId) {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  }

  static async createStripeAccount(user_id, stripe_account_id) {
    const result = await pool.query(
      "INSERT INTO stripe_account (user_id, stripe_account_id) VALUES ($1,$2) RETURNING *",
      [user_id, stripe_account_id]
    );
    return result.rows[0];
  }

  static async checkStripeAccountExist(user_id) {
    const result = await pool.query(
      "SELECT * FROM stripe_account WHERE user_id = $1",
      [user_id]
    );
    return result.rows[0];
  }

  static async deleteStripeAccount(id) {
    const result = await pool.query(
      `DELETE FROM stripe_account WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  static async updateStripeAccount(
    charges_enabled,
    payouts_enabled,
    details_submitted,
    stripe_account_id
  ) {
    const result = await pool.query(
      `UPDATE stripe_account 
      SET charges_enabled = COALESCE($1, charges_enabled),
      SET payouts_enabled = COALESCE($2, payouts_enabled),
      SET details_submitted = COALESCE($3, details_submitted)
      WHERE stripe_account_id = $4 RETURNING *`,
      [charges_enabled, payouts_enabled, details_submitted, stripe_account_id]
    );
    return result.rows[0];
  }
}

module.exports = Ai;
