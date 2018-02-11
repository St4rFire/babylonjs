package it.openmindonline.babylonjs;

import java.io.InputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class BabylonController
{

    @RequestMapping("/")
    public String babylon(Model model) {
        return "babylon";
    }

    @RequestMapping("/bag")
    public String bag(Model model) {
        return "bag";
    }

    @RequestMapping("/scene")
    public String scene(Model model) {
        return "scene";
    }


    @RequestMapping(value = "/downloadtexture")
    public void downloadOrder(@RequestParam(value="name") String name, HttpServletResponse response)
    {

        try (InputStream in = getClass().getResourceAsStream("/static/babylon/mesh/spaceship/0.png")) // todo use convention
        {
            response.setHeader("Content-Disposition", "attachment; filename=" + name + ".png");
            response.setContentType("application/xml");
            //response.setContentLength(in.length);
            ServletOutputStream outputStream = response.getOutputStream();
            IOUtils.copy(in, outputStream);
            IOUtils.closeQuietly(outputStream);
            IOUtils.closeQuietly(in);
        }
        catch (Exception e)
        {
            //log.error("Error exporting order {}", orderNumber, e);
        }
    }




}
