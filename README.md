# HolyCitizenDCBot

Discord.js v14 ile geliştirilmiş, çok sunuculu bir Discord botu. Karşılama, XP/seviye, destek talepleri, başvuru değerlendirme ve temel moderasyon komutları sunar.

## Türkçe

### Gereksinimler

- Node.js 18 veya üzeri
- Discord Developer Portal'da oluşturulmuş bir bot uygulaması
- Botu eklediğiniz sunucularda gerekli rol ve kanal izinleri

### Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasına bot token'ını ve uygulama kimliğini girin. `DISCORD_TOKEN` gizlidir; bu dosyayı veya token'ı paylaşmayın. `.env` Git tarafından yok sayılır.

Discord Developer Portal'da bot için **Server Members Intent** seçeneğini etkinleştirin. Botu `bot` ve `applications.commands` OAuth2 kapsamlarıyla sunuculara ekleyin. Gerekli izinler:

- `View Channels`, `Send Messages`, `Read Message History`: karşılama, XP ve raid uyarıları
- `Manage Roles`: otomatik rol ve başvuru onayı; botun en yüksek rolü atanacak rollerin üstünde olmalı
- `Manage Channels`: özel destek kanalı açma ve kapama
- `Ban Members`, `Kick Members`, `Manage Messages`: ilgili moderasyon komutları

### Sunucu Ayarları

Discord kimlikleri sunucuya özgüdür. Birden fazla sunucuda rol ve kanal özelliklerini kullanmak için `.env` içindeki `GUILD_SETTINGS` JSON nesnesine her sunucunun kimliğini ve kendi ayarlarını ekleyin:

```dotenv
GUILD_SETTINGS='{"GUILD_ID":{"autoRoleId":"ROLE_ID","supportRoleId":"ROLE_ID","applicationReviewChannelId":"CHANNEL_ID","approvedRoleId":"ROLE_ID"}}'
```

`GUILD_ID`, `ROLE_ID` ve `CHANNEL_ID` metinlerini gerçek Discord kimlikleriyle değiştirin. Birden fazla sunucu için JSON'a ayrı guild girdileri ekleyin. Alanlar isteğe bağlıdır. Tek sunuculu kullanımda `AUTO_ROLE_ID`, `SUPPORT_ROLE_ID`, `APPLICATION_REVIEW_CHANNEL_ID` ve `APPROVED_ROLE_ID` yedek değişkenleri kullanılabilir.

`autoRoleId`, sunucuya katılan her insan üyeye atanır. Bu nedenle `Meclis Üyesi` rolünü yalnızca her yeni üyeye verilmesi amaçlanıyorsa yapılandırın. Başvuru onay rolü `approvedRoleId` ile ayrıca belirlenir. Başvuru inceleme kanalını yalnızca yetkililerin görebildiğinden emin olun.

### Özellikler ve Komutlar

| Komut | Açıklama |
| --- | --- |
| `/help` | Komut listesini gösterir |
| `/ping` | Bot gecikmesini gösterir |
| `/level [user]` | XP ve seviyeyi gösterir |
| `/destek` | Özel destek kanalı açar |
| `/kapat` | Destek kanalını kapatır |
| `/basvuru` | Yetkili başvuru formunu açar |
| `/ban` | Üyeyi yasaklar |
| `/kick` | Üyeyi sunucudan uzaklaştırır |
| `/clear` | Mesajları temizler |

Yeni üyeler en düşük sıradaki metin kanalında karşılanır. XP, üye başına dakikada en fazla bir kez ve 15-25 arasında verilir. İlk seviye 100 XP, sonraki her seviye 100 ek XP gerektirir. XP verisi yerel `data/levels.json` dosyasında saklanır.

Anti-raid varsayılan olarak 10 saniyede 5 katılımı algılayıp uyarı gönderir. `RAID_JOIN_THRESHOLD` ve `RAID_WINDOW_MS` ile ayarlanabilir. Sistem otomatik kick, ban veya kanal kilitlemesi yapmaz.

Bot yanıtları Discord kullanıcı diline göre Türkçe veya İngilizce verilir. Harici çeviri servisine mesaj gönderilmez.

### Çalıştırma ve Test

```bash
npm start
npm test
```

Slash komutları bot başlatıldığında uygulama genelinde kaydedilir. Global komutların Discord'da görünmesi zaman alabilir.

## English

### Requirements

- Node.js 18 or newer
- A bot application created in the Discord Developer Portal
- The required role and channel permissions in each server

### Installation

```bash
npm install
cp .env.example .env
```

Set the bot token and application ID in `.env`. `DISCORD_TOKEN` is a secret; do not share it. Git ignores `.env`.

Enable **Server Members Intent** in the Discord Developer Portal. Invite the bot with the `bot` and `applications.commands` OAuth2 scopes. Required permissions:

- `View Channels`, `Send Messages`, `Read Message History`: welcome messages, XP, and raid alerts
- `Manage Roles`: automatic roles and application approvals; the bot's highest role must be above the assigned roles
- `Manage Channels`: create and close private support channels
- `Ban Members`, `Kick Members`, `Manage Messages`: the corresponding moderation commands

### Per-Server Configuration

Discord role and channel IDs are specific to each server. To use these features across multiple servers, add each guild and its IDs to the `GUILD_SETTINGS` JSON object in `.env`:

```dotenv
GUILD_SETTINGS='{"GUILD_ID":{"autoRoleId":"ROLE_ID","supportRoleId":"ROLE_ID","applicationReviewChannelId":"CHANNEL_ID","approvedRoleId":"ROLE_ID"}}'
```

Replace `GUILD_ID`, `ROLE_ID`, and `CHANNEL_ID` with the actual Discord IDs. Add a separate guild entry for every server. All fields are optional. For a single-server setup, `AUTO_ROLE_ID`, `SUPPORT_ROLE_ID`, `APPLICATION_REVIEW_CHANNEL_ID`, and `APPROVED_ROLE_ID` are supported as fallbacks.

`autoRoleId` is assigned to every human who joins that server. Configure the `Meclis Üyesi` role only if every new member should receive it. The application approval role is configured separately with `approvedRoleId`. Restrict the application review channel to staff.

### Features and Commands

| Command | Description |
| --- | --- |
| `/help` | Lists available commands |
| `/ping` | Shows bot latency |
| `/level [user]` | Shows XP and level progress |
| `/destek` | Opens a private support channel |
| `/kapat` | Closes a support channel |
| `/basvuru` | Opens the staff application form |
| `/ban` | Bans a member |
| `/kick` | Kicks a member |
| `/clear` | Clears messages |

New members are welcomed in the text channel with the lowest position. XP is awarded between 15 and 25, at most once per member per minute. The first level requires 100 XP; each subsequent level requires 100 more XP. XP data is stored locally in `data/levels.json`.

By default, anti-raid detection alerts on 5 joins within 10 seconds. Tune it with `RAID_JOIN_THRESHOLD` and `RAID_WINDOW_MS`. It does not automatically kick, ban, or lock channels.

Bot replies use Turkish or English based on the Discord user's locale. Messages are not sent to an external translation service.

### Run and Test

```bash
npm start
npm test
```

Slash commands are registered globally when the bot starts. Global commands may take some time to appear in Discord.

## Integrations Not Yet Configured

The shortcut application endpoint and external translation-app integration still need their API URL/path, request/response examples, and authentication type. Arbitrary shell-command execution is not supported. Keep all credentials in `.env`, never in source control or chat.