#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

// TODO: get fb pages with the access token
#[tauri::command]
fn fb_pages(token: &str) -> String {
   format!("Get fb pages with, {}!", token)
}

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .invoke_handler(tauri::generate_handler![fb_pages, greet])
    .run(context)
    .expect("error while running tauri application");
}
