const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { device_id, signal } = data;

    if (!device_id) {
      return { statusCode: 400, body: JSON.stringify({ error: "device_id required" }) };
    }

    // Insert record into Supabase
    const { error } = await supabase
      .from('heartbeats')
      .insert([{ device_id: device_id, signal_strength: signal || 0 }]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ok", message: "Heartbeat logged" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
