fn main() -> std::io::Result<()> {
    println!("cargo:rerun-if-changed=../proto/sync.proto");
    prost_build::compile_protos(&["../proto/sync.proto"], &["../proto"])?;
    Ok(())
}
