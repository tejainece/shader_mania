float pi = 3.14159265;
float oneDegreeInRadian = 0.01745329251;
vec3 hue = vec3(.0, .4, 0.0);

float addCircles(vec2 uv) {
    float diff = length(uv);
    float scale = 3.;
    float func = exp(-abs(sin(2. * pi * scale * diff)));
    return smoothstep(0.9, 0.95, func);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    float aspect = iResolution.x/iResolution.y;
    uv.x *= aspect;
    float t = iTime;
    float dist = length(uv);
    vec3 color = vec3(0.0);
    float fade = (1.0 - smoothstep(0.0, 1.0, dist));
    color += hue * addCircles(uv) * fade;
    fragColor = vec4(color, 1.0);
}
