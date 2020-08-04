function graphQLResultHasError(result) {
    return (result.errors && result.errors.length > 0) || false;
}

export { graphQLResultHasError };
//# sourceMappingURL=errorHandling.js.map
