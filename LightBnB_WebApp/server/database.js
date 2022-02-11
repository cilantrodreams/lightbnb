const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  host: 'localhost',
  password: '123',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1;
  `, [email])
    .then(result => result.rows[0])
    .catch(err => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1;
  `, [id])
    .then(result => result.rows[0])
    .catch(err => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  return pool.query(`
    INSERT INTO users (
    name, password, email)
    VALUES (
    $1, $2, $3)
    RETURNING *;
  `, Object.values(user))
    .then(result => {
      console.log(result.rows);
    })
    .catch(err => {
      console.log(err.message);
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  return pool.query(`
    SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
    FROM reservations
    JOIN properties ON properties.id = property_id
    JOIN users ON users.id = guest_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE users.id = $1 AND
      end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY start_date
    LIMIT $2;
  `, [guest_id, limit])
    .then(result => {
      if (!result.rows.length) {
        return null;
      }
      return result.rows;
    }).catch(err => {
      console.log(err.message, err.stack);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  console.log(options);
  if (Object.values(options).some(e => e)) {
    queryString += `WHERE `;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    if (queryParams.length) {
      queryString += `AND `;
    }
    queryParams.push(options.owner_id);
    queryString += `owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    if (queryParams.length) {
      queryString += `AND `;
    }
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    if (queryParams.length) {
      queryString += `AND `;
    }
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `cost_per_night <= $${queryParams.length} `;
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message, err.stack);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  //   const propertyId = Object.keys(properties).length + 1;
  //   property.id = propertyId;
  //   properties[propertyId] = property;
  //   return Promise.resolve(property);

  const queryKeys = Object.keys(property);
  const queryParams = Object.values(property);
  let queryString = `
  INSERT INTO properties (
  `;

  queryKeys.forEach((item, index, arr) => {
    queryString += `${item}`;
    if (arr[index + 1]) {
      queryString += `, `;
    }
  });

  queryString += `)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  console.log('property:', property);
  console.log('queryString:', queryString);
  console.log('queryParams:', queryParams);
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.log(err.message, err.stack);
    });
}
exports.addProperty = addProperty;
