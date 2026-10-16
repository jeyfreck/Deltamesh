use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Configura el compilador de protoc empaquetado
    env::set_var("PROTOC", protoc_bin_vendored::protoc_bin_path()?);

    // Obliga a Cargo a recompilar si el esquema protobuf cambia
    println!("cargo:rerun-if-changed=../proto/sync.proto");

    let mut config = prost_build::Config::new();
    
    // Genera atributos de serialización serde adicionales si son necesarios
    config.type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]");

    config.compile_protos(
        &["../proto/sync.proto"],
        &["../proto"],
    )?;

    Ok(())
}
