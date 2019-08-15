describe("feathers-data-provider", () => {
  describe("type: GET_LIST", () => {
    it("generates a query out of the params", () => {});
    it("outputs {data: feathersjsClient.service(resource).find({query})}", () => {});
  });

  describe("type: GET_MANY", () => {
    it("generates a query out of the params.ids", () => {});
    it("outputs {data: feathersjsClient.service(resource).find({query})}", () => {});
  });

  describe("type: GET_ONE", () => {
    it("outputs {data: feathersjsClient.service(resource).get(params.id)}", () => {});
  });

  describe("type: GET_MANY_REFERENCE", () => {
    it("generates a query containing {[params.target]: params.id}", () => {});

    it("outputs {data: feathersjsClient.service(resource).find({query})}", () => {});
  });

  describe("type: UPDATE", () => {
    it(
      "outputs {data: feathersjsClient.service(resource).patch(params.id, data)}"
    );
    describe("uploads", () => {
      it("makes a POST to the uploadsUrl in case the resource has an uploadable field", () => {});

      it("outputs response from the upload if the resource is the same as the one on the uploadsUrl", () => {});

      // eslint-disable-next-line no-multi-str
      it("updates the data to include the output from the POST to the uploadsUrl\
      if resource is not the upload resource", () => {});
    });
  });

  describe("type: UPDATE_MANY", () => {
    it("generates a query out of the params.ids", () => {});
    it(
      "outputs {data: feathersjsClient.service(resource).patch(null, data, {query})}"
    );
    describe("uploads", () => {
      it("makes a POST to the uploadsUrl in case the resource has an uploadable field", () => {});

      it("outputs response from the upload if the resource is the same as the one on the uploadsUrl", () => {});

      // eslint-disable-next-line no-multi-str
      it("updates the data to include the output from the POST to the uploadsUrl\
      if resource is not the upload resource", () => {});
    });
  });

  describe("type: CREATE", () => {
    it("outputs {data: feathersjsClient.service(resource).create(data)}");
    describe("uploads", () => {
      it("makes a POST to the uploadsUrl in case the resource has an uploadable field", () => {});

      it("outputs response from the upload if the resource is the same as the one on the uploadsUrl", () => {});

      // eslint-disable-next-line no-multi-str
      it("updates the data to include the output from the POST to the uploadsUrl\
      if resource is not the upload resource", () => {});
    });
  });

  describe("type: DELETE", () => {
    it("outputs {data: feathersjsClient.service(resource).remove(params.id)}", () => {});
  });

  describe("type: DELETE_MANY", () => {
    it("generates a query out of the params", () => {});
    it("outputs {data: feathersjsClient.service(resource).remove(null, {query})}", () => {});
  });
});
