# ra-feathers-oauth [![Build Status](https://travis-ci.org/sopherapps/ra-feathers-oauth.svg?branch=master)](https://travis-ci.org/sopherapps/ra-feathers-oauth) [![Coverage Status](https://coveralls.io/repos/github/sopherapps/ra-feathers-oauth/badge.svg?branch=master)](https://coveralls.io/github/sopherapps/ra-feathers-oauth?branch=master)

This provides a `data-provider` and an `auth-provider` for the your [react admin](https://marmelab.com/react-admin) app connecting it to a [feathersjs 4](https://crow.docs.feathersjs.com/) app

## Installation

This is an NPM package. Run the command below for your [React Admin](https://marmelab.com/react-admin) app folder

```bash
npm install --save ra-feathersjs-oauth
```

## Major Requirements

Your feathersjs server should be running on version 4 and above.

## Configuration of components

### create-feathers-client

### feathers-auth-provider

### feathers-data-provider

## Usage

### Example of the index file of a react admin app

```JavaScript
import React from "react";
import {
  Admin, Resource
} from "react-admin";

import { UserList, UserEdit, UserShow } from "./resources/users";
import { PostEdit, PostCreate, PostList, PostShow } from "./resources/posts";

import GoogleLogin from "./components/screens/GoogleLogin";

import {feathersDataProvider, feathersAuthProvider, createFeathersClient} from "ra-feathers-oauth";

import PostIcon from "@material-ui/icons/Send";
import UserIcon from "@material-ui/icons/Group";

const apiUrl = "http://localhost:3030";

const feathersClient = createFeathersClient(apiUrl, {
  storageKey: "a-unique-storage-key"
});

const dataProvider = feathersDataProvider(feathersClient, {
  uploadsUrl: `${apiUrl}/uploads`,
  multerFieldNameSetting: "files",
  resourceUploadsForeignKeyMap: { posts: "_id", uploads: "url" },
  resourceUploadableFieldMap: { posts: "image", uploads: "url" },
  defaultPrimaryKeyField: "_id"
});
const authProvider = feathersAuthProvider(feathersClient, {
  permissionsField: "permissions",
  oauthStrategy: "google"
});

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={GoogleLogin}
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      show={UserShow}
      icon={UserIcon}
    />
    <Resource
      name="posts"
      list={PostList}
      create={PostCreate}
      edit={PostEdit}
      show={PostShow}
      icon={PostIcon}
    />
  </Admin>
);

export default App;
```

### Example of the GoogleLogin component for a react admin app

It uses the [react-google-login](https://github.com/anthonyjgrove/react-google-login) package

```JavaScript
import React from "react";
import { connect } from "react-redux";
import { userLogin } from "react-admin";
import ReactGoogleLogin from "react-google-login";
import Grid from "@material-ui/core/Grid";

const googleClientId = "<the google client id for your app>";

const GoogleLogin = ({ userLogin }) => {
  const handleResponse = response => {
    const access_token = response.getAuthResponse().access_token;
    if (access_token) {
      userLogin({ access_token });
    }
  };
  return (
    <Grid
      justify="center"
      alignItems="center"
      container
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <ReactGoogleLogin
          clientId={googleClientId}
          buttonText="Login With Google"
          onSuccess={handleResponse}
          onFailure={handleResponse}
        />
      </Grid>
    </Grid>
  );
};

export default connect(
  undefined,
  { userLogin }
)(GoogleLogin);
```

## Advanced Docs

For more details of each class, interface, enum etc, visit [the TypeDoc generated docs site](https://sopherapps.github.io/ra-feathersjs-oauth).

## Acknowledgements

[Ra-data-feathers](https://github.com/josx/ra-data-feathers) was a big motivation.

## License

Copyright (c) 2019 [Martin Ahindura](https://github.com/Tinitto) Licensed under the [MIT License](./LICENSE)
