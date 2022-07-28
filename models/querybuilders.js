function generateWhereQuery(genre, channel) {
  if (genre && channel) {
    return `WHERE c.name = '${channel}' AND g.genre = '${genre}'`;
  } else if (genre) {
    return `WHERE g.genre = '${genre}'`;
  } else if (channel) {
    return `WHERE c.name = '${channel}'`;
  } else {
    return '';
  }
}

function generateSortQuery(sort) {
  const byPopularity = 'ORDER BY COUNT(p.id) DESC';
  const byMostRecent = 'ORDER BY p.release_date DESC';

  if (sort === '인기순') {
    return byPopularity;
  } else if (sort === '최신순') {
    return byMostRecent;
  } else {
    return byPopularity;
  }
}

function searchFilter(keyword) {
  const searchColumn = ['title', 'genre', 'creators', 'name'];
  const conditions = searchColumn.map(
    column => `${column} LIKE '%${keyword}%'`
  );
  return `(${conditions.join(' OR ')})`;
}

module.exports = {
  generateWhereQuery,
  generateSortQuery,
  searchFilter,
};
