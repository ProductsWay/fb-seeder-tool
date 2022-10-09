#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::collections::HashMap;

extern crate html2text;

use html2text::from_read;

#[macro_use]
extern crate log;
mod fb;

const FB_URL: &str = "https://graph.facebook.com/v15.0";

#[tokio::main]
async fn fetch_fb_groups(
    token: &str,
    after: &str,
) -> Result<fb::FacebookGroups, Box<dyn std::error::Error>> {
    let api_url = format!(
        "{}/me/groups?fields=id,name,link,description,picture&access_token={}&after={}",
        FB_URL, token, after
    );
    info!("api_url: {}", api_url);

    let resp = reqwest::get(api_url)
        .await?
        .json::<fb::FacebookGroups>()
        .await?;

    Ok(resp)
}

#[tokio::main]
async fn fetch_fb_pages(
    token: &str,
    after: &str,
) -> Result<fb::FacebookPages, Box<dyn std::error::Error>> {
    let api_url = format!(
        "{}/me/accounts?fields=page_token&access_token={}&after={}",
        FB_URL, token, after
    );
    info!("api_url: {}", api_url);

    let resp = reqwest::get(api_url)
        .await?
        .json::<fb::FacebookPages>()
        .await?;

    Ok(resp)
}

#[tokio::main]
async fn publish_to_fb_page(
    token: &str,
    msg: &str,
    page_id: &str,
) -> Result<fb::FeedResponse, Box<dyn std::error::Error>> {
    let api_url = format!("{}/{}/feed?access_token={}", FB_URL, page_id, token);
    info!("api_url: {}", api_url);

    let mut map = HashMap::new();
    map.insert("message", from_read(msg.as_bytes(), 80));

    let client = reqwest::Client::new();
    let resp = client
        .post(api_url)
        .json(&map)
        .send()
        .await?
        .json::<fb::FeedResponse>()
        .await?;

    Ok(resp)
}

#[tauri::command]
fn fb_groups(token: &str, after: &str) -> String {
    // serialize the response to a json string
    let resp = fetch_fb_groups(token, after).unwrap();
    let json = serde_json::to_string(&resp).unwrap();

    // debug to the console
    warn!("facebook groups {}", json);
    json
}

#[tauri::command]
fn fb_pages(token: &str, after: &str) -> String {
    // serialize the response to a json string
    let resp = fetch_fb_pages(token, after).unwrap();
    let json = serde_json::to_string(&resp).unwrap();

    // debug to the console
    warn!("facebook pages {}", json);
    json
}

#[tauri::command]
fn post_to_fb_page(token: &str, msg: &str, page_id: &str) -> String {
    // serialize the response to a json string
    let resp = publish_to_fb_page(token, msg, page_id).unwrap();
    let json = serde_json::to_string(&resp).unwrap();

    // debug to the console
    warn!("publish to page {}", json);
    json
}

fn main() {
    env_logger::init();
    info!("starting up");

    let context = tauri::generate_context!();
    tauri::Builder::default()
        // TODO: support FB app by getting access token, refer https://tauri.app/blog/2022/09/19/tauri-egui-0-1/
        .setup(|app| {
            app.wry_plugin(tauri_egui::EguiPluginBuilder::new(app.handle()));
            Ok(())
        })
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![
            fb_groups,
            fb_pages,
            post_to_fb_page
        ])
        .run(context)
        .expect("error while running tauri application");
}
