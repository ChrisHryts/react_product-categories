import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getCategoryById(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId);
}

function getUserById(ownerId) {
  return usersFromServer.find(user => user.id === ownerId);
}

const products = productsFromServer.map((product) => {
  const category = getCategoryById(product.categoryId);
  const owner = getUserById(category.ownerId);

  return {
    ...product,
    category,
    owner,
  };
});

// const SORT_BY_ID = 'ID';
// const SORT_BY_PRODUCT = 'Product';
// const SORT_BY_CATEGORY = 'Category';
// const SORT_BY_USER = 'User';

function getProductsList(startproducts, { query, selectedUser }) {
  let productsList = [...startproducts];

  if (query) {
    const queryTrim = query.toLowerCase().trim();

    productsList = productsList.filter(
      product => product.name.toLowerCase().includes(queryTrim),
    );
  }

  if (selectedUser && selectedUser !== 'All') {
    productsList = productsList.filter(
      product => product.owner.id === selectedUser,
    );
  }

  // if (sortBy) {
  //   productsList.sort((product1, product2) => {
  //     switch (sortBy) {
  //       case SORT_BY_ID: return product1.id - product2.id;
  //       case SORT_BY_PRODUCT:
  //         return product1.name.localeCompare(product2.name);
  //       case SORT_BY_CATEGORY:
  //         return product1.category.name.localeCompare(product2.category.name);
  //       case SORT_BY_USER:
  //         return product1.owner.name.localeCompare(product2.owner.name);
  //       default:
  //         return 0;
  //     }
  //   });
  // }

  return productsList;
}

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('All');
  // const [sortBy, setSortBy] = useState('');
  const visibleProducts = getProductsList(
    products,
    { query, selectedUser },
  );
  const isListEmpty = visibleProducts.length === 0;

  const reset = () => {
    setQuery('');
    setSelectedUser('All');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames(
                  { 'is-active': selectedUser === 'All' },
                )}
                onClick={() => setSelectedUser('All')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={classNames(
                    { 'is-active': selectedUser === user.id },
                  )}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {isListEmpty && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {!isListEmpty && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': product.owner.sex === 'm',
                        'has-text-danger': product.owner.sex === 'f',
                      })}
                    >
                      {product.owner.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
