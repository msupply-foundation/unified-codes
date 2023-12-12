fn main() {
    cynic_codegen::register_schema("universal_codes")
        .from_sdl_file("dgraph.graphql")
        .unwrap()
        .as_default()
        .unwrap();
}
