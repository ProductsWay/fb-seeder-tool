#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#[macro_use]
extern crate log;
mod fb;

#[tokio::main]
async fn my_fb_groups(
    token: &str,
    after: &str,
) -> Result<fb::FacebookGroups, Box<dyn std::error::Error>> {
    let api_url = format!(
            "https://graph.facebook.com/v14.0/me/groups?fields=id,name,link,description,picture&access_token={}&after={}",
            token, after
        );
    info!("api_url: {}", api_url);

    let resp = reqwest::get(api_url)
        .await?
        .json::<fb::FacebookGroups>()
        .await?;

    Ok(resp)
}

#[tokio::main]
async fn my_fb_pages(
    token: &str,
    after: &str,
) -> Result<fb::FacebookPages, Box<dyn std::error::Error>> {
    let api_url = format!(
        "https://graph.facebook.com/v14.0/me/accounts?fields=page_token&access_token={}&after={}",
        token, after
    );
    info!("api_url: {}", api_url);

    let resp = reqwest::get(api_url)
        .await?
        .json::<fb::FacebookPages>()
        .await?;

    Ok(resp)
}

#[tauri::command]
fn fb_groups(token: &str, after: &str) -> String {
    // serialize the response to a json string
    let resp = my_fb_groups(token, after).unwrap();
    let json = serde_json::to_string(&resp).unwrap();

    // debug to the console
    warn!("facebook groups {}", json);
    json
}

#[tauri::command]
fn fb_pages(token: &str, after: &str) -> String {
    // serialize the response to a json string
    let resp = my_fb_pages(token, after).unwrap();
    let json = serde_json::to_string(&resp).unwrap();

    // debug to the console
    warn!("facebook pages {}", json);
    json
}

fn main() {
    env_logger::init();
    info!("starting up");

    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![fb_groups, fb_pages])
        .run(context)
        .expect("error while running tauri application");
}
