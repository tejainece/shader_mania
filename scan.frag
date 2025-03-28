float pi = 3.14159265;
float oneDegreeInRadian = 0.01745329251;

vec2 toPolar(vec2 c) {return vec2(length(c), atan(-c.y, -c.x) + pi);}

float lineSegDist( vec2 uv, vec2 ba, vec2 a, float r ) {
    vec2 pa = uv - a - ba*r; ba = -ba*r*2.0;
    return length( pa - ba*clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 ) );
}

float round_(float value) {
	if (fract(value) < 0.5)
        return floor(value);
    else 
        return ceil(value);
}

float addRadii2(vec2 uv) {
	vec2 polarUv = toPolar(uv);
    float theta = polarUv.y; // [0, 2.0 * pi]
    float d = 45.0;
    float alpha = d * oneDegreeInRadian;
    float edge = round(theta/alpha);
    
    //float angle = edge/(360.0/d);
    float angle = edge/(360.0/d) * 2.0 * pi;
    
    vec2 end = vec2(cos(angle), sin(angle));
    
    float line = lineSegDist(uv, end, vec2(0.0), 2.0);
    
    float r = 1.0-smoothstep(0.005, 0.0055, line);
    
    return r;
}

float addRadii(vec2 uv) {
    vec2 polarUv = toPolar(uv);
    float theta = polarUv.y; // [0, 2.0 * pi]
    float d = 90.0;
    float alpha = d * oneDegreeInRadian;
    float edge = floor(theta/alpha);
    
    return mod(edge, 2.0) == 0.0 ? 0.0 : 1.0;
}

float addCircles(vec2 uv) {
    float diff = length(uv);
	float scale = 5.0;
    float func = exp(-abs(sin(scale * pi * diff)));
    return smoothstep(0.9, 0.95, func);
}

float addCircle(vec2 uv, float scale) {
    return 0.0;
}

float addCurrentAngle(vec2 uv, float angle) {
	vec2 rotatedPolarPos0 = toPolar(uv);
    float detectionEdgeDist0 = (mod(-rotatedPolarPos0.y, 2.0 * pi) - angle) / pi;
    float currentAngle = smoothstep(0.0, 0.001, detectionEdgeDist0);
    
    float diff = length(uv);
    float func = exp(-abs(sin(3.9269908169872415480783042290994 * diff)));
    float circle = smoothstep(0.98, 0.99, func);
    
    float t = pi * iTime;
    vec2 end = vec2(cos(-angle), sin(-angle));
    float line = 1.0-smoothstep(0.010, 0.015, lineSegDist(uv - end, end, vec2(0.0), 1.0));
    
    return currentAngle * (1.0 + circle + line);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = (fragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    float aspect = iResolution.x/iResolution.y;
    uv.x *= aspect;
    
    float t = iTime;
    float dist = length(uv);
    vec3 color = vec3(0.0);
    
    float r = (1.0 - smoothstep(0.0, 1.0, dist));
        
    color += vec3(.0, .4, 0.0) * addCircles(uv) * r;
    color += vec3(0., .4, 0.0) * addCurrentAngle(uv, (2.0 * pi * abs(cos(t)))) * (1.0 - smoothstep(0.0, 1.5, dist));
    
    color += vec3(0.0, .4, 0.0) * addRadii2(uv) * (1.0 - smoothstep(0.8, 0.9, dist));
    
    fragColor = vec4(color, 1.0);
}
