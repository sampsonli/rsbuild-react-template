
#[tauri::command]
fn my_custom_command(a: f32, b: f32) ->f32 {
    println!("开始计算");
    let c = a*b;
    println!("值为:{}",c);
    c
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![my_custom_command])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
